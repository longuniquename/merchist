Meteor.publish('products', function () {
    return Products.find({isPublic: true});
});

Meteor.publish('products.my', function () {
    return Products.find({userId: this.userId});
});

Meteor.publish('product', function (productId) {
    return Products.find({ _id: productId });
});
