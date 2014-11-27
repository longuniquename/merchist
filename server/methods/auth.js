(function () {

    Meteor.methods({
        userAddOauthCredentials: function (token, secret, userId, service) {
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
        }
    });

})();
