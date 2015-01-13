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

    var credentialToken = Random.secret(),
        scope = (options && options.requestPermissions) || ['ACCESS_BASIC_PERSONAL_DATA'],
        loginStyle = OAuth._loginStyle('paypal', config, options),
        loginUrl = Meteor.absoluteUrl('_paypal/requestPermissions') +
            '?scope=' + scope.join(',') +
            '&callback=' + encodeURIComponent(OAuth._redirectUri('paypal', config, {state: OAuth._stateParam(loginStyle, credentialToken)}));

    OAuth.launchLogin({
        loginService:                      "paypal",
        loginStyle:                        loginStyle,
        loginUrl:                          loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken:                   credentialToken,
        popupOptions:                      {width: 900, height: 450}
    });
};
