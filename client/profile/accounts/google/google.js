(function(){

    Template.profileAccountsGoogle.events({
        'click .attachBtn': function(e, template){
            e.preventDefault();

            Google.requestCredential(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                },
                function(token){
                    var secret = OAuth._retrieveCredentialSecret(token);
                    Meteor.call('userAddOauthCredentials', token, secret, Meteor.userId(), 'google', function(err, resp){
                        console.log(arguments);
                    })
                }
            );
        },
        'click .detachBtn': function(e, template){
            e.preventDefault();
            Meteor.call('userRemoveOauthCredentials', 'google', function(err, resp){
                console.log(arguments);
            });
        }
    });

})();
