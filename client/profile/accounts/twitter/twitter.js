(function(){

    Template.profileAccountsTwitter.events({
        'click .attachBtn': function(e, template){
            e.preventDefault();

            Meteor.loginWithTwitter(
                {
                    loginStyle:         'popup'
                },
                function (err) {
                    console.log(arguments);
                }
            );

        }
    });

})();
