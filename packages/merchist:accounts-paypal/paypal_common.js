Accounts.oauth.registerService('paypal');

if (Meteor.isClient) {
    Meteor.loginWithPayPal = function(options, callback) {
        // support a callback without options
        if (! callback && typeof options === "function") {
            callback = options;
            options = null;
        }

        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
        PayPal.requestCredential(options, credentialRequestCompleteCallback);
    };
} else {
    Accounts.addAutopublishFields({
        forLoggedInUser: ['services.paypal'],
        forOtherUsers: [
            'services.paypal.id', 'services.paypal.username', 'services.paypal.gender'
        ]
    });
}
