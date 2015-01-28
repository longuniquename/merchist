Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find(
            {
                _id: this.userId
            },
            {
                fields: {
                    'services': 1
                }
            }
        );
    } else {
        this.ready();
    }
});

Meteor.publish("user", function (userId) {
    return Meteor.users.find({_id: userId});
});
