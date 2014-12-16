(function(){

    Template.splash.events({
        'click .facebookBtn': function (e, template) {
            e.preventDefault();
            template.$('.auth').addClass('hidden');
            template.$('.loading').removeClass('hidden');


            Meteor.loginWithFacebook(
                {
                    requestPermissions: ['public_profile', 'email', 'user_friends'],
                    loginStyle:         'popup'
                },
                function (err) {
                    template.$('.auth').removeClass('hidden');
                    template.$('.loading').addClass('hidden');

                    if (!err) {
                        Router.go('marketplace');
                    }
                }
            );
        }
    });

})();
