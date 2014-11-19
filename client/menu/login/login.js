(function(){

    Template.login.events({
        'submit form': function(e, template){
            e.preventDefault();
            var email = template.$('[name="email"]').val();
            var password = template.$('[name="password"]').val();

            Meteor.loginWithPassword(email, password, function(err){
                console.log(err);
            });
        },
        'click .loginFacebookBtn': function(e, template){
            e.preventDefault();

            Meteor.loginWithFacebook({}, function(err){
                console.log(err);
            });
        }
    });

})();