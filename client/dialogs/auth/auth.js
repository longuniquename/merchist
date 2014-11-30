(function () {

    Template.authDlg.events({
        'submit form':        function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            var email = template.$('[name="email"]').val(),
                password = template.$('[name="password"]').val();

            Meteor.loginWithPassword({email: email}, password, function (err) {
                if (!err) {
                    $dlg.modal('hide');
                } else {
                    console.log(err);
                }
            });
        },
        'click .facebookBtn': function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            if (Meteor.isCordova) {
                facebookConnectPlugin.login(
                    ['public_profile', 'email'],
                    function(response){
                        alert(JSON.stringify(response));
                        facebookConnectPlugin.getAccessToken(function(token) {
                            alert("Token: " + token);
                        }, function(err) {
                            alert("Could not get access token: " + err);
                        });
                    },
                    function(err){
                        alert(JSON.stringify(err));
                    }
                );
            } else {
                Meteor.loginWithFacebook(
                    {
                        requestPermissions: ['email'],
                        loginStyle:         'popup'
                    },
                    function (err) {
                        if (!err) {
                            $dlg.modal('hide');
                        } else {
                            console.log(err);
                        }
                    }
                );
            }
        },
        'click .googleBtn': function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            Meteor.loginWithGoogle(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                },
                function (err) {
                    if (!err) {
                        $dlg.modal('hide');
                    } else {
                        console.log(err);
                    }
                }
            );
        },
        'click .twitterBtn': function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            Meteor.loginWithTwitter(
                {
                    loginStyle:         'popup'
                },
                function (err) {
                    if (!err) {
                        $dlg.modal('hide');
                    } else {
                        console.log(err);
                    }
                }
            );
        }
    });

})();