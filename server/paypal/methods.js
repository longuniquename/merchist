(function () {

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

            return 'https://sandbox.paypal.com/cgi-bin/webscr?cmd=_grant-permission&request_token=' + response.data.token;
        }
    });

})();
