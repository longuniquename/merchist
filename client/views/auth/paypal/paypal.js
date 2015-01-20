(function () {

    Template.authPayPalView.events({
        'click .payPalBtn': function (e, template) {
            e.preventDefault();

            PayPal.requestCredential(
                {
                    requestPermissions: ['REFUND', 'ACCESS_BASIC_PERSONAL_DATA', 'ACCESS_ADVANCED_PERSONAL_DATA']
                },
                function (token) {
                    var secret = OAuth._retrieveCredentialSecret(token);
                    Meteor.call('userAddOauthCredentials', token, secret, Meteor.userId(), 'paypal', function (err, resp) {
                        if (err) {
                            alert(err.reason);
                        }
                    })
                }
            );
        }
    });

})();
