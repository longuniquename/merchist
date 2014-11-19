(function () {

    Template.login.events({
        'submit form':             function (e, template) {
            e.preventDefault();
            var email = template.$('[name="email"]').val();
            var password = template.$('[name="password"]').val();

            Meteor.loginWithPassword(email, password, function (err, result) {
                console.log(err, result);
            });
        },
        'click .loginFacebookBtn': function (e, template) {
            e.preventDefault();

            Meteor.loginWithFacebook(
                {
                    requestPermissions: ['manage_pages']
                },
                function (err, result) {
                    console.log(err, result);
                }
            );
        }
    });

})();