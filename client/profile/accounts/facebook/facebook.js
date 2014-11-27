(function(){

    Template.profileAccountsFacebook.events({
        'click .attachBtn': function(e, template){
            e.preventDefault();

            Meteor.loginWithFacebook(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                },
                function (err) {
                    console.log(arguments);
                }
            );

        }
    });

})();
