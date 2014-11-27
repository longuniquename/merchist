(function(){

    Template.profileAccountsTwitter.events({
        'click .attachBtn': function(e, template){
            e.preventDefault();

            Twitter.requestCredential(
                {
                    loginStyle:         'popup'
                },
                function(token){
                    var secret = OAuth._retrieveCredentialSecret(token);
                    Meteor.call('userAddOauthCredentials', token, secret, Meteor.userId(), 'twitter', function(err, resp){
                        console.log(arguments);
                    })
                }
            );
        },
        'click .detachBtn': function(e, template){
            e.preventDefault();
            Meteor.call('userRemoveOauthCredentials', 'twitter', function(err, resp){
                console.log(arguments);
            });
        }
    });

})();
