(function(){

    Template.authView.events({
        'click .facebookBtn': function (e, template) {
            e.preventDefault();

            Meteor.loginWithFacebook(
                {
                    requestPermissions: ['public_profile', 'email', 'user_friends'],
                    loginStyle:         'popup'
                }
            );
        }
    });

})();
