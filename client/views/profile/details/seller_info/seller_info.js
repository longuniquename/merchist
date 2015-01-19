(function () {

    Template.profileDetailsSellerInfo.helpers({
        'notVerified': function(){
            return this.accountStatus !== 'VERIFIED';
        },
        'notBusiness': function(){
            return (this.accountType !== 'BUSINESS' && this.accountType !== 'PREMIER');
        }
    });

    Template.profileDetailsSellerInfo.events({
        'click .attachBtn': function(e, template){
            e.preventDefault();

            PayPal.requestCredential(
                {
                    requestPermissions: ['REFUND', 'ACCESS_BASIC_PERSONAL_DATA', 'ACCESS_ADVANCED_PERSONAL_DATA']
                },
                function(token){
                    var secret = OAuth._retrieveCredentialSecret(token);
                    Meteor.call('userAddOauthCredentials', token, secret, Meteor.userId(), 'paypal', function(err, resp){
                        console.log(arguments);
                    })
                }
            );

        }
    });

})();
