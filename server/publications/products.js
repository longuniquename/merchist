Meteor.publish('products', function (options) {

    _.defaults(options, {
        sort:  {createdAt: -1},
        limit: 12,
        my:    false
    });

    check(options, {
        sort:  Object,
        limit: Number,
        my:    Boolean
    });

    var criteria = {};

    if (options.my) {
        criteria.userId = Meteor.userId();
    } else {
        criteria.isPublic = true;
    }

    return Products.find(criteria, {sort: options.sort, limit: options.limit});
});

Meteor.publish('products.my', function () {
    return Products.find({userId: this.userId});
});

Meteor.publish('product', function (productId) {
    return Products.find({_id: productId});
});
