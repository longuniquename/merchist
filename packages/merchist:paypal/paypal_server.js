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
    }
});

OAuth.registerService('paypal', 2, null, function (query) {

    var accessToken = getAccessToken(query);
    var identity = getIdentity(accessToken);

    return {
        serviceData: {
            id:          identity.id,
            accessToken: OAuth.sealSecret(accessToken.token),
            email:       identity.email,
            username:    identity.email
        },
        options:     {
            profile: {
                name:      identity.firstName + ' ' + identity.lastName,
                firstName: identity.firstName,
                lastName:  identity.lastName
            }
        }
    };
});

var getAccessToken = function (query) {
    return _.pick(
        Meteor.call('PayPal:Permissions:GetAccessToken', query["request_token"], query["verification_code"]),
        'scope', 'token', 'tokenSecret'
    );
};

var getIdentity = function (accessToken) {
    var response = Meteor.call('PayPal:Permissions:GetAdvancedPersonalData', accessToken["token"], accessToken["tokenSecret"]),
        identity = {};

    Object.keys(response.response.personalData).map(function (i) {
        var dataItem = response.response.personalData[i];

        switch (dataItem.personalDataKey) {
            case 'http://axschema.org/namePerson/first':
                if (dataItem.personalDataValue)
                    identity.firstName = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/namePerson/last':
                if (dataItem.personalDataValue)
                    identity.lastName = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/contact/email':
                if (dataItem.personalDataValue)
                    identity.email = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/company/name':
                if (dataItem.personalDataValue)
                    identity.company = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/contact/country/home':
                if (dataItem.personalDataValue)
                    identity.country = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/contact/postalCode/home':
                if (dataItem.personalDataValue)
                    identity.postalCode = dataItem.personalDataValue;
                break;
            case 'http://schema.openid.net/contact/street1':
                if (dataItem.personalDataValue)
                    identity.street1 = dataItem.personalDataValue;
                break;
            case 'http://schema.openid.net/contact/street2':
                if (dataItem.personalDataValue)
                    identity.street2 = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/contact/city/home':
                if (dataItem.personalDataValue)
                    identity.city = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/contact/state/home':
                if (dataItem.personalDataValue)
                    identity.state = dataItem.personalDataValue;
                break;
            case 'http://axschema.org/contact/phone/default':
                if (dataItem.personalDataValue)
                    identity.phone = dataItem.personalDataValue;
                break;
            case 'https://www.paypal.com/webapps/auth/schema/payerID':
                if (dataItem.personalDataValue)
                    identity.id = dataItem.personalDataValue;
                break;
        }
    });

    return identity;
};

WebApp.connectHandlers.use("/_paypal/requestPermissions", function(req, res, next) {

    check(req.query.scope, String);
    check(req.query.callback, String);

    var config = getConfig();

    var scope = _.map(req.query.scope.split(','), function(perm){
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
