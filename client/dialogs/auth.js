(function(){

    Template.authDlg.events({
        'submit form': function(e, template){
            e.preventDefault();
            var $dlg = $(template.firstNode);

            var email = template.$('[name="email"]').val(),
                password = template.$('[name="password"]').val();

            Meteor.loginWithPassword({email: email}, password, function(err){
                if (!err) {
                    $dlg.modal('hide');
                } else {
                    console.log(err);
                }
            });
        },
        'click .facebookBtn': function(e, template){
            e.preventDefault();
            Meteor.loginWithFacebook({
                requestPermissions: ['email'],
                loginStyle: 'popup'
            }, function(){
                console.log(arguments);
            });
        }
    });

})();