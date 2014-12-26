Meteor.publish('products', function () {
    return Products.find();
});

Meteor.publish('myProducts', function () {
    return Products.find({userId: this.userId});
});

Meteor.publish('product', function (productId) {
    return Products.find({ _id: productId });
});

Meteor.publish('shopProducts', function (shopId) {
    return Products.find({ shopId: shopId });
});
