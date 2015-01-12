// Request PayPal credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
PayPal.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'paypal'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    var scope = (options && options.requestPermissions) || ['ACCESS_BASIC_PERSONAL_DATA'],
        callback = OAuth._redirectUri('paypal', config);

    Meteor.call('PayPal:Permissions:RequestPermissions', scope, callback, function (err, response) {
        if (err) {
            throw err;
        }

        var loginStyle = OAuth._loginStyle('paypal', config, options);

        var loginUrl = (config.sandbox ? 'https://sandbox.paypal.com/' : 'https://www.paypal.com/') +
            'cgi-bin/webscr?cmd=_grant-permission&request_token=' + response.token;

        console.log(loginUrl);

        OAuth.launchLogin({
            loginService:                      "paypal",
            loginStyle:                        loginStyle,
            loginUrl:                          loginUrl,
            credentialRequestCompleteCallback: credentialRequestCompleteCallback,
            credentialToken:                   credentialToken,
            popupOptions:                      {width: 900, height: 450}
        });
    });
};
