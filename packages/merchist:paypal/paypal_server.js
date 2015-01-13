var apiEndpoint = function (url, sandbox) {
    return (sandbox ? 'https://svcs.sandbox.paypal.com/' : 'https://svcs.paypal.com/') + url;
};

var getConfig = function () {
    var config = ServiceConfiguration.configurations.findOne({service: 'paypal'});
    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }
    return config;
};

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

var personalAttributesMap = {
    'https://www.paypal.com/webapps/auth/schema/payerID': 'id',
    'http://axschema.org/namePerson/first':               'firstName',
    'http://axschema.org/namePerson/last':                'lastName',
    'http://schema.openid.net/contact/fullname':          'fullName',
    'http://axschema.org/birthDate':                      'birthDate',
    'http://axschema.org/company/name':                   'company',
    'http://axschema.org/contact/email':                  'email',
    'http://axschema.org/contact/phone/default':          'phone',
    'http://axschema.org/contact/country/home':           'country',
    'http://axschema.org/contact/state/home':             'state',
    'http://axschema.org/contact/city/home':              'city',
    'http://schema.openid.net/contact/street1':           'street1',
    'http://schema.openid.net/contact/street2':           'street2',
    'http://axschema.org/contact/postalCode/home':        'postalCode'
};

Meteor.methods({
    'PayPal:Permissions:RequestPermissions':      function (scope, callback) {
        var config = getConfig(),
            url = apiEndpoint('Permissions/RequestPermissions', config.sandbox),
            data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                scope:           scope,
                callback:        callback
            },
            headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       config.appId,
                "X-PAYPAL-SECURITY-USERID":      config.userId,
                "X-PAYPAL-SECURITY-PASSWORD":    config.password,
                "X-PAYPAL-SECURITY-SIGNATURE":   config.signature
            };

        var response = HTTP.post(url, {data: data, headers: headers});

        return response.data;
    },
    'PayPal:Permissions:GetAccessToken':          function (requestToken, verificationCode) {
        var config = getConfig(),
            url = apiEndpoint('Permissions/GetAccessToken', config.sandbox),
            data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                token:           requestToken,
                verifier:        verificationCode
            },
            headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       config.appId,
                "X-PAYPAL-SECURITY-USERID":      config.userId,
                "X-PAYPAL-SECURITY-PASSWORD":    config.password,
                "X-PAYPAL-SECURITY-SIGNATURE":   config.signature
            };

        var response = HTTP.post(url, {data: data, headers: headers});

        return response.data;
    },
    'PayPal:Permissions:GetAdvancedPersonalData': function (token, tokenSecret) {
        var config = getConfig(),
            url = apiEndpoint('Permissions/GetAdvancedPersonalData', config.sandbox),
            data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                attributeList:   {
                    attribute: _.keys(personalAttributesMap)
                }
            },
            headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       config.appId,
                "X-PAYPAL-AUTHORIZATION":        generateFullAuthString(
                    config.userId,
                    config.password,
                    token,
                    tokenSecret,
                    'POST',
                    url
                )
            };

        var response = HTTP.post(url, {data: data, headers: headers});

        return response.data;
    },
    'PayPal:AdaptiveAccounts:GetVerifiedStatus':  function (emailAddress, firstName, lastName) {
        var config = getConfig(),
            url = apiEndpoint('AdaptiveAccounts/GetVerifiedStatus', config.sandbox),
            data = {
                requestEnvelope: {
                    detailLevel:   'ReturnAll',
                    errorLanguage: 'en_US'
                },
                emailAddress:    emailAddress,
                firstName:       firstName,
                lastName:        lastName,
                matchCriteria:   'NAME'
            },
            headers = {
                "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                "X-PAYPAL-APPLICATION-ID":       config.appId,
                "X-PAYPAL-SECURITY-USERID":      config.userId,
                "X-PAYPAL-SECURITY-PASSWORD":    config.password,
                "X-PAYPAL-SECURITY-SIGNATURE":   config.signature
            };

        var response = HTTP.post(url, {data: data, headers: headers});

        return response.data;
    }
});

OAuth.registerService('paypal', 2, null, function (query) {

    var accessToken = getAccessToken(query),
        identity = getIdentity(accessToken),
        verifiedStatus = getVerifiedStatus(identity),
        serviceData = {};

    _.extend(serviceData, accessToken, identity, verifiedStatus);

    return {
        serviceData: serviceData,
        options:     {
            profile: {
                firstName: identity.firstName,
                lastName:  identity.lastName
            }
        }
    };
});

var getAccessToken = function (query) {
    var accessToken = Meteor.call('PayPal:Permissions:GetAccessToken', query["request_token"], query["verification_code"]),
        whitelisted = ['scope', 'token', 'tokenSecret'];

    return _.pick(accessToken, whitelisted);
};

var getIdentity = function (accessToken) {
    var response = Meteor.call('PayPal:Permissions:GetAdvancedPersonalData', accessToken["token"], accessToken["tokenSecret"]),
        identity = {};

    _.each(response.response.personalData, function (dataItem) {
        if (_.has(personalAttributesMap, dataItem.personalDataKey) && dataItem.personalDataValue) {
            identity[personalAttributesMap[dataItem.personalDataKey]] = dataItem.personalDataValue;
        }
    });

    return identity;
};

var getVerifiedStatus = function (identity) {
    var response = Meteor.call('PayPal:AdaptiveAccounts:GetVerifiedStatus', identity["email"], identity["firstName"], identity["lastName"]);
    return {
        accountStatus: response.accountStatus,
        accountType:   response.userInfo.accountType
    };
};

PayPal.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

WebApp.connectHandlers.use("/_paypal/requestPermissions", function (req, res, next) {

    check(req.query.scope, String);
    check(req.query.callback, String);

    var config = getConfig();

    var scope = _.map(req.query.scope.split(','), function (perm) {
        return perm.trim();
    });

    var callback = req.query.callback,
        response = Meteor.call('PayPal:Permissions:RequestPermissions', scope, callback),
        loginUrl = (config.sandbox ? 'https://sandbox.paypal.com/' : 'https://www.paypal.com/') +
            'cgi-bin/webscr?cmd=_grant-permission&request_token=' + response.token;

    res.statusCode = 302;
    res.setHeader("Location", loginUrl);
    res.end();
});
