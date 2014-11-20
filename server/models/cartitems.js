Meteor.publish('myCart', function (cartId) {
    return CartItems.find({cartId: cartId});
});
