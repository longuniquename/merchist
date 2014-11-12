Meteor.publish('shops', function () {
    return Shops.find();
});

Meteor.publish('shop', function (shopId) {
    return Shops.find({ _id: shopId });
});