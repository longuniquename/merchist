Meteor.publish('shops', function () {
    return Shops.find();
});

Meteor.publish('shop', function (shopId) {
    return Shops.find({ _id: shopId });
});

Meteor.publish('myShops', function () {
    return Shops.find({"managers.userId": this.userId});
});
