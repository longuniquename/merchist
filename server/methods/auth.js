(function () {

    Meteor.methods({
        userAddOauthCredentials:    function (token, secret, userId, service) {
            var data;
            switch (service) {
                case 'facebook':
                    data = Facebook.retrieveCredential(token, secret).serviceData;
                    break;
                case 'google':
                    data = Google.retrieveCredential(token, secret).serviceData;
                    break;
                case 'twitter':
                    data = Twitter.retrieveCredential(token, secret).serviceData;
                    break;
                default:
                    return false;
            }
            var selector = {};
            selector['services.' + service + '.id'] = data.id;

            if (Meteor.users.findOne(selector)) {
                throw new Meteor.Error(500, "This account has already been assigned to another user.");
            }

            var updateSelector = {};
            updateSelector['services.' + service] = data;

            Meteor.users.update(userId, {$set: updateSelector});

            return true;
        },
        userRemoveOauthCredentials: function (service) {
            if (Meteor.users.findOne(this.userId)) {

                var updateSelector = {};
                updateSelector['services.' + service] = '';

                Meteor.users.update(this.userId, {$unset: updateSelector});

                return true;
            }

            return false;
        },
        userAddEmailAddress:        function (email) {
            if (Meteor.users.findOne(this.userId)) {

                if (Meteor.users.findOne({'emails.address': email})) {
                    throw new Meteor.Error(500, "This email has already been assigned to another user.");
                }

                Meteor.users.update(this.userId, {$push: {emails: {address: email, verified: false}}});

                Accounts.sendVerificationEmail(this.userId, email);

                return true;
            }

            return false;
        },
        userRemoveEmailAddress:     function (email) {
            if (Meteor.users.findOne(this.userId)) {
                Meteor.users.update(this.userId, {$pull: {emails: {address: email}}});
                return true;
            }

            return false;
        }
    });

})();
