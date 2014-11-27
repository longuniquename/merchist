(function () {

    var createAdmin = function(email){
        var user = Meteor.users.findOne({'emails.address': email});
        if (!user) {
            Accounts.createUser({
                email:    email,
                profile:  {
                    isAdmin:   true
                }
            });
            user = Meteor.users.findOne({'emails.address': email});
            Accounts.sendResetPasswordEmail(user._id);
        } else if (!user.profile || !user.profile.isAdmin) {
            Meteor.users.update(user._id, {$set: {
                'profile.isAdmin': true
            }});
        }
    };

    Meteor.startup(function () {
        createAdmin('dmitry.les@mercher.net');
        createAdmin('yury.adamov@mercher.net');
        createAdmin('sam.pogosov@mercher.net');
    });

})();
