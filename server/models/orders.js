Meteor.publish('myOrders', function (cartId) {
    if (this.userId) {
        return Orders.find({userId: this.userId});
    } else {
        return Orders.find({cartId: cartId});
    }
});

Meteor.publish('order', function (orderId) {
    return Orders.find({ _id: orderId });
});
