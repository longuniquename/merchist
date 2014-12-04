(function () {

    function rfc3986(str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/\*/g, '%2A')
            .replace(/\./g, "%2E")
            .replace(/\+/g, ' ')
            .replace(/-/g, '%2D')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/'/g, '%27')
            .replace(/%7E/g, '~')
            ;
    }

    var genSign = function (consumerKey, consumerSecret, token, tokenSecret, httpMethod, endpoint) {
        var data = {
            "oauth_consumer_key":     consumerKey,
            "oauth_signature_method": "HMAC-SHA1",
            "oauth_timestamp":        Math.round((new Date()).getTime() / 1000),
            "oauth_token":            token,
            "oauth_version":          "1.0"
        };

        var dataString = Object.keys(data).sort().map(function (i) {
            return i + '=' + data[i]
        }).join('&');

        var dataArray = [
            httpMethod.toUpperCase(),
            endpoint,
            dataString
        ];

        var baseString = dataArray.map(function (i) {
            return rfc3986(i).replace(/(%[A-Za-z0-9]{2})/g, function (s) {
                return s.toLowerCase();
            });
        }).join('&');

        var keyParts = [
            consumerSecret,
            tokenSecret ? tokenSecret : ""
        ];

        var key = keyParts.map(function (i) {
            return rfc3986(i).replace(/(%[A-Za-z0-9]{2})/g, function (s) {
                return s.toLowerCase();
            });
        }).join('&');

        var hmac = Npm.require('crypto').createHmac('sha1', key);
        hmac.update(baseString);
        data["oauth_signature"] = hmac.digest('base64');
        return data;
    };

    var generateFullAuthString = function (consumerKey, consumerSecret, token, tokenSecret, httpMethod, endpoint) {
        var response = genSign(consumerKey, consumerSecret, token, tokenSecret, httpMethod, endpoint);
        return "token=" + response['oauth_token'] +
            ",signature=" + response['oauth_signature'] +
            ",timestamp=" + response['oauth_timestamp'];
    };

    Meteor.methods({
        'PayPal:generateAccountRequest': function (shopId, returnUrl, cancelUrl) {
            var baseUrl = 'https://svcs.sandbox.paypal.com/',
                url = baseUrl + 'Permissions/RequestPermissions';

            var data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                scope:           [
                    'REFUND',
                    'ACCESS_BASIC_PERSONAL_DATA',
                    'ACCESS_ADVANCED_PERSONAL_DATA'
                ],
                callback:        returnUrl
            };

            var headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       'APP-80W284485P519543T',
                "X-PAYPAL-SECURITY-USERID":      'dmitriy.s.les-facilitator_api1.gmail.com',
                "X-PAYPAL-SECURITY-PASSWORD":    '1391764851',
                "X-PAYPAL-SECURITY-SIGNATURE":   'AIkghGmb0DgD6MEPZCmNq.bKujMAA8NEIHryH-LQIfmx7UZ5q1LXAa7T'
            };

            var response = Meteor.wrapAsync(HTTP.post)(url, {data: data, headers: headers});
            Shops.update(shopId, {$addToSet: {'payments.PayPal.accountRequests': response.data.token}});
            return 'https://sandbox.paypal.com/cgi-bin/webscr?cmd=_grant-permission&request_token=' + response.data.token;
        },
        'PayPal:verifyAccountRequest':   function (params) {
            var shop = Shops.findOne({'payments.PayPal.accountRequests': params.request_token});

            var baseUrl = 'https://svcs.sandbox.paypal.com/',
                url = baseUrl + 'Permissions/GetAccessToken';

            var data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                token:           params.request_token,
                verifier:        params.verification_code
            };

            var headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       'APP-80W284485P519543T',
                "X-PAYPAL-SECURITY-USERID":      'dmitriy.s.les-facilitator_api1.gmail.com',
                "X-PAYPAL-SECURITY-PASSWORD":    '1391764851',
                "X-PAYPAL-SECURITY-SIGNATURE":   'AIkghGmb0DgD6MEPZCmNq.bKujMAA8NEIHryH-LQIfmx7UZ5q1LXAa7T'
            };

            var response = Meteor.wrapAsync(HTTP.post)(url, {data: data, headers: headers});

            var token = response.data.token,
                tokenSecret = response.data.tokenSecret,
                scope = response.data.scope;

            url = baseUrl + 'Permissions/GetAdvancedPersonalData';

            data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                attributeList:   {
                    attribute: [
                        'http://axschema.org/namePerson/first',
                        'http://axschema.org/namePerson/last',
                        'http://axschema.org/contact/email',
                        'http://axschema.org/company/name',
                        'http://axschema.org/contact/country/home',
                        'http://axschema.org/contact/postalCode/home',
                        'http://schema.openid.net/contact/street1',
                        'http://schema.openid.net/contact/street2',
                        'http://axschema.org/contact/city/home',
                        'http://axschema.org/contact/state/home',
                        'http://axschema.org/contact/phone/default',
                        'https://www.paypal.com/webapps/auth/schema/payerID'
                    ]
                }
            };

            headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       'APP-80W284485P519543T',
                "X-PAYPAL-AUTHORIZATION":        generateFullAuthString(
                    'dmitriy.s.les-facilitator_api1.gmail.com',
                    '1391764851',
                    token,
                    tokenSecret,
                    'POST',
                    url
                )
            };

            response = Meteor.wrapAsync(HTTP.post)(url, {data: data, headers: headers});

            var profile = {},
                contact = {address: {}};
            Object.keys(response.data.response.personalData).map(function (i) {
                var dataItem = response.data.response.personalData[i];
                switch (dataItem.personalDataKey) {
                    case 'http://axschema.org/namePerson/first':
                        if (dataItem.personalDataValue)
                            profile.firstName = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/namePerson/last':
                        if (dataItem.personalDataValue)
                            profile.lastName = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/contact/email':
                        if (dataItem.personalDataValue)
                            contact.email = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/company/name':
                        if (dataItem.personalDataValue)
                            profile.company = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/contact/country/home':
                        if (dataItem.personalDataValue)
                            contact.address.country = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/contact/postalCode/home':
                        if (dataItem.personalDataValue)
                            contact.address.postalCode = dataItem.personalDataValue;
                        break;
                    case 'http://schema.openid.net/contact/street1':
                        if (dataItem.personalDataValue)
                            contact.address.street1 = dataItem.personalDataValue;
                        break;
                    case 'http://schema.openid.net/contact/street2':
                        if (dataItem.personalDataValue)
                            contact.address.street2 = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/contact/city/home':
                        if (dataItem.personalDataValue)
                            contact.address.city = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/contact/state/home':
                        if (dataItem.personalDataValue)
                            contact.address.state = dataItem.personalDataValue;
                        break;
                    case 'http://axschema.org/contact/phone/default':
                        if (dataItem.personalDataValue)
                            contact.phone = dataItem.personalDataValue;
                        break;
                }
            });

            url = baseUrl + 'AdaptiveAccounts/GetVerifiedStatus';

            data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                emailAddress:    contact.email,
                firstName:       profile.firstName,
                lastName:        profile.lastName,
                matchCriteria:   'NAME'
            };

            headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       'APP-80W284485P519543T',
                "X-PAYPAL-SECURITY-USERID":      'dmitriy.s.les-facilitator_api1.gmail.com',
                "X-PAYPAL-SECURITY-PASSWORD":    '1391764851',
                "X-PAYPAL-SECURITY-SIGNATURE":   'AIkghGmb0DgD6MEPZCmNq.bKujMAA8NEIHryH-LQIfmx7UZ5q1LXAa7T'
            };

            response = Meteor.wrapAsync(HTTP.post)(url, {data: data, headers: headers});

            var verified = response.data.accountStatus === 'VERIFIED',
                type = response.data.userInfo.accountType,
                id = response.data.userInfo.accountId;

            Shops.update(shop._id, {
                $set:   {
                    'payments.PayPal.account': {
                        id:          id,
                        token:       token,
                        tokenSecret: tokenSecret,
                        type:        type,
                        verified:    verified,
                        scope:       scope,
                        profile:     profile,
                        contact:     contact
                    }
                },
                $unset: {
                    'payments.PayPal.accountRequests': ''
                }
            });

            return shop._id;
        },
        'PayPal:getPayKey':              function (orderId) {
            var order = Orders.findOne(orderId),
                shop = Shops.findOne(order.shopId);

            var baseUrl = 'https://svcs.sandbox.paypal.com/',
                url = baseUrl + 'AdaptivePayments/Pay';

            var data = {
                requestEnvelope:                   {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                actionType:                        'PAY',
                currencyCode:                      'USD',
                feesPayer:                         'PRIMARYRECEIVER',
                payKeyDuration:                    'PT15M',
                reverseAllParallelPaymentsOnError: true,
                ipnNotificationUrl:                Meteor.absoluteUrl('paypal/ipn'),
                clientDetails:                     {
                    applicationId: 'Merchist',
                    partnerName:   'Mercher Inc.'
                },
                receiverList:                      {
                    receiver: [
                        {
                            amount:      order.total,
                            email:       shop.payments.PayPal.account.contact.email,
                            paymentType: 'GOODS',
                            primary:     true
                        },
                        {
                            amount:      Math.ceil(order.total * 2) / 100,
                            email:       'dmitriy.s.les-facilitator@gmail.com',
                            paymentType: 'SERVICE',
                            primary:     false
                        }
                    ]
                },
                trackingId:                        order._id,
                cancelUrl:                         Meteor.absoluteUrl('orders/' + order._id),
                returnUrl:                         Meteor.absoluteUrl('orders/' + order._id)
            };

            var headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       'APP-80W284485P519543T',
                "X-PAYPAL-SECURITY-USERID":      'dmitriy.s.les-facilitator_api1.gmail.com',
                "X-PAYPAL-SECURITY-PASSWORD":    '1391764851',
                "X-PAYPAL-SECURITY-SIGNATURE":   'AIkghGmb0DgD6MEPZCmNq.bKujMAA8NEIHryH-LQIfmx7UZ5q1LXAa7T'
            };

            var response = Meteor.wrapAsync(HTTP.post)(url, {data: data, headers: headers});

            Orders.update(order._id, {$set: {'payPal.payKey': response.data.payKey}});

            return response.data.payKey;
        }
    });

})();
