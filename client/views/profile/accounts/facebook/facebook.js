(function(){

    Template.profileAccountsFacebook.events({
        'click .attachBtn': function(e, template){
            e.preventDefault();

            Facebook.requestCredential(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                },
                function(token){
                    var secret = OAuth._retrieveCredentialSecret(token);
                    Meteor.call('userAddOauthCredentials', token, secret, Meteor.userId(), 'facebook', function(err, resp){
                        console.log(arguments);
                    })
                }
            );

        },
        'click .detachBtn': function(e, template){
            e.preventDefault();
            Meteor.call('userRemoveOauthCredentials', 'facebook', function(err, resp){
                console.log(arguments);
            });
        }
    });

})();
