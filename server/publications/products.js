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

    var productsCursor = Products.find({isPublic: true}, options);
    var productsHandle = productsCursor.observeChanges({
        added:   function (id, product) {
            product.isReserved = isReserved(id);
            ordersHandlers[id] = watchReservations(id, sub);
            sub.added('products', id, product);
        },
        changed: function (id, fields) {
            sub.changed('products', id, fields);
        },
        removed: function (id) {
            ordersHandlers[id] && ordersHandlers[id].stop();
            delete ordersHandlers[id];
            sub.removed('products', id);
        }
    });

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

var isReserved = function (productId) {
    return !!Orders.find({
        'items.productId': productId,
        'paypal.payKey':   {$exists: true}
    }).count();
};

var reservedDue = function (productId) {
    var maxExpirationDate = new Date();
    maxExpirationDate.setTime(0);

    Orders.find({
        'items.productId':             productId,
        'paypal.payKey':               {$exists: true},
        'paypal.payKeyExpirationDate': {$exists: true}
    }).forEach(function (order) {
        maxExpirationDate.setTime(Math.max(maxExpirationDate.getTime(), order.paypal.payKeyExpirationDate.getTime()));
    });

    if (maxExpirationDate.getTime() > (new Date()).getTime()) {
        return maxExpirationDate;
    } else {
        return null;
    }
};

var watchReservations = function (productId, sub) {
    var changeTimeout;

    var ordersHandler = Orders.find({
        'items.productId':             productId,
        'paypal.payKey':               {$exists: true},
        'paypal.payKeyExpirationDate': {$exists: true}
    }).observeChanges({
        added:   function (orderId, order) {
            var reservation = reservedDue(productId);
            if (reservation) {
                sub.changed('products', productId, {isReserved: true});
            } else {
                sub.changed('products', productId, {isReserved: false});
            }
        },
        changed: function (orderId, fields) {
            console.log(fields);
            sub.changed('products', productId, {isReserved: isReserved(productId)});
        },
        removed: function (orderId) {
            sub.changed('products', productId, {isReserved: isReserved(productId)});
        }
    });

    return ordersHandler;
};
