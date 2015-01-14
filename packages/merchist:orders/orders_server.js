Orders.deny({
    insert: function (userId, doc) {
        //Initial status of order should be 'new'
        if (doc.status !== 'new') {
            return true;
        }

        //Can't create orders for other users
        if ((doc.userId || Meteor.userId()) && doc.userId !== Meteor.userId()) {
            return true;
        }

        return false;
    }
});

Meteor.publish("orders", function () {
    return Orders.find();
});
