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

    var productsCursor = Products.find({isPublic: true}, options),
        initializing = true,
        productsHandle = productsCursor.observeChanges({
            added:   function (id, product) {
                console.log('product ' + id + ' "' + product.title + '" added');
                if (!initializing) {
                    ordersHandlers[id] = watchReservations(id, sub);
                }
                sub.added('products', id, product);
            },
            changed: function (id, fields) {
                console.log('product ' + id + ' "' + product.title + '" changed');
                sub.changed('products', id, fields);
            },
            removed: function (id) {
                console.log('product ' + id + ' removed');
                ordersHandlers[id] && ordersHandlers[id].stop();
                delete ordersHandlers[id];
                sub.removed('products', id);
            }
        });
    productsCursor.forEach(function (product) {
        if (initializing) {
            ordersHandlers[product._id] && ordersHandlers[product._id].stop();
            ordersHandlers[product._id] = watchReservations(product._id, sub);
        }
    });
    initializing = false;

    sub.ready();

    sub.onStop(function () {
        productsHandle.stop();
        _.each(ordersHandlers, function (ordersHandler) {
            ordersHandler.stop();
        });
    });
});

Meteor.publish('products.my', function () {
    return Products.find({userId: this.userId});
});

Meteor.publish('product', function (productId) {
    return Products.find({_id: productId});
});

var checkReserved = function (productId, sub) {
    var orders = Orders.find({
        'items.productId':             productId,
        'paypal.payKey':               {$exists: true},
        'paypal.payKeyExpirationDate': {$gt: new Date()}
    }, {
        fields: {
            'paypal.payKeyExpirationDate': true
        }
    });

    console.log('checking orders for product ' + productId, orders.fetch());

    var maxExpirationDate = new Date();
    maxExpirationDate.setTime(0);

    orders.forEach(function (order) {
        maxExpirationDate.setTime(Math.max(maxExpirationDate.getTime(), order.paypal.payKeyExpirationDate.getTime()));

        if (order.paypal.payKeyExpirationDate.getTime() > (new Date()).getTime()) {
            var delay = Math.max(1000, order.paypal.payKeyExpirationDate.getTime() - (new Date()).getTime() + 1000);
            console.log('will expire in ' + (order.paypal.payKeyExpirationDate.getTime() - (new Date()).getTime()) / 1000 + ' seconds');
            console.log('check postponed for ' + delay / 1000 + ' seconds');
            Meteor.setTimeout(function () {
                checkReserved(productId, sub);
            }, delay);
        }
    });

    console.log({
        isReserved:  !!orders.count(),
        reservedDue: (maxExpirationDate.getTime() > (new Date()).getTime()) ? maxExpirationDate : undefined
    });

    sub.changed(
        'products',
        productId,
        {
            isReserved:  !!orders.count(),
            reservedDue: (maxExpirationDate.getTime() > (new Date()).getTime()) ? maxExpirationDate : undefined
        }
    );
};

var watchReservations = function (productId, sub) {
    var initializing = true,
        ordersCursor = Orders.find({
            'items.productId':             productId,
            'paypal.payKey':               {$exists: true},
            'paypal.payKeyExpirationDate': {$exists: true}
        }),
        ordersHandle = ordersCursor.observeChanges({
            added:   function (orderId, order) {
                console.log('order ' + orderId + ' added for product ' + productId);
                if (!initializing) {
                    checkReserved(productId, sub);
                }
            },
            changed: function (orderId, fields) {
                console.log('order ' + orderId + ' changed for product ' + productId);
                checkReserved(productId, sub);
            },
            removed: function (orderId) {
                console.log('order ' + orderId + ' removed for product ' + productId);
                checkReserved(productId, sub);
            }
        });
    if (initializing && ordersCursor.count()) {
        checkReserved(productId, sub);
    }
    initializing = false;

    return ordersHandle;
};
