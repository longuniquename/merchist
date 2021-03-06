Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},
            {fields: {'services': 1}});
    } else {
        this.ready();
    }
});

Meteor.publish("allUsersData", function () {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        if (user.profile && user.profile.isAdmin) {
            return Meteor.users.find();
        }
    } else {
        this.ready();
    }
});

Meteor.users.allow({
    remove: function (userId) {
        if (userId) {
            var user = Meteor.users.findOne(userId);
            if (user.profile && user.profile.isAdmin) {
                return true;
            }
        }
        return false;
    }
});
