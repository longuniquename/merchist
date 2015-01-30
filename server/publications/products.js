Meteor.publish('products', function (options) {
    var sub = this;

    _.defaults(options, {
        sort:  {createdAt: -1},
        limit: 12
    });

    check(options, {
        sort:  Object,
        limit: Number
    });

    var ordersHandlers = {};

    var initializing = true;

    var productsCursor = Products.find({isPublic: true}, options);
    var productsHandle = productsCursor.observeChanges({
        added:   function (id, product) {
            //set initial isReserved value
            if (initializing) {
                product.isReserved = isReserved(id);
            }

            //watch orders to update isReserved value immediately
            ordersHandlers[id] = Orders.find({
                'items.productId': id,
                'paypal.payKey':   {$exists: true}
            }).observeChanges({
                added:   function (orderId, order) {
                    if (!initializing) {
                        sub.changed('products', id, {isReserved: isReserved(id)});
                    }
                },
                changed: function (orderId, fields) {
                    sub.changed('products', id, {isReserved: isReserved(id)});
                },
                removed: function (orderId) {
                    sub.changed('products', id, {isReserved: isReserved(id)});
                }
            });

            sub.added('products', id, product);
        },
        changed: function (id, fields) {
            sub.changed('products', id, fields);
        },
        removed: function (id) {
            ordersHandlers[id] && ordersHandlers[id].stop();
            sub.removed('products', id);
        }
    });

    initializing = false;

    sub.ready();

    sub.onStop(function () {
        productsHandle.stop();
    });
});

Meteor.publish('products.my', function () {
    return Products.find({userId: this.userId});
});

Meteor.publish('product', function (productId) {
    return Products.find({_id: productId});
});

var isReserved = function (productId) {
    return !!Orders.find({
        'items.productId': productId,
        'paypal.payKey':   {$exists: true}
    }).count();
};
