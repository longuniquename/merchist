Meteor.publish('products', function (options) {
    _.defaults(options, {
        sort:  {createdAt: -1},
        limit: 12
    });
    check(options, {
        sort:  Object,
        limit: Number
    });
    return Products.find({isPublic: true}, options);
});

Meteor.publish('products.my', function () {
    return Products.find({userId: this.userId});
});

Meteor.publish('product', function (productId) {
    return Products.find({_id: productId});
});
