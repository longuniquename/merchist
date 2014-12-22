Meteor.loginWithFacebookConnect = function(options, callback) {
    _.defaults(options, {requestPermissions: ['public_profile', 'email']});

    facebookConnectPlugin.login(
        options.requestPermissions,
        function (response) {
            var loginRequest = {service: 'facebookConnect', data: response.authResponse};
            Accounts.callLoginMethod({
                methodArguments: [loginRequest],
                userCallback: callback
            });
        },
        function (err) {
            callback && callback(err);
        }
    );
};
