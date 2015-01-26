(function () {

    Template.splashView.events({
        'click .facebookBtn': function (e, template) {
            e.preventDefault();

            var requestPermissions = ['public_profile', 'email', 'user_friends'];

            if (Meteor.isCordova) {
                Meteor.loginWithFacebookConnect({
                    requestPermissions: requestPermissions
                });
            } else {
                Meteor.loginWithFacebook({
                    requestPermissions: requestPermissions,
                    loginStyle:         'popup'
                });
            }
        }
    });

})();
