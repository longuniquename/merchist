Meteor.publish('myOrders', function (cartId) {
    if (this.userId) {
        return Orders.find({userId: this.userId});
    } else {
        return Orders.find({cartId: cartId});
    }
});
