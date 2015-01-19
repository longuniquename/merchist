(function () {

    Template.splashView.events({
        'click .facebookBtn': function (e, template) {
            e.preventDefault();
            template.$('.auth').addClass('hidden');
            template.$('.loading').removeClass('hidden');

            var requestPermissions = ['public_profile', 'email', 'user_friends'],
                processResponse = function (err) {
                    if (!err) {
                        Router.go('marketplace');
                    } else {
                        template.$('.auth').removeClass('hidden');
                        template.$('.loading').addClass('hidden');
                    }
                };

            if (Meteor.isCordova) {
                Meteor.loginWithFacebookConnect({
                    requestPermissions: requestPermissions
                }, processResponse);
            } else {
                Meteor.loginWithFacebook({
                    requestPermissions: requestPermissions,
                    loginStyle:         'popup'
                }, processResponse);
            }
        }
    });

})();
