// Set status to requested when new order gets payKey
Orders.find({status: 'NEW', 'paypal.payKey': {$exists: true}}).observe({
    added:   function (document) {
        Orders.update({_id: document._id}, {$set: {status: 'REQUESTED'}});
        _.each(document.items, function(orderItem){
            // transfer items from available to reserved
            Products.update(orderItem.productId, {$inc: {'inventory.available': -orderItem.amount, 'inventory.reserved': orderItem.amount}});
        });
    }
});

// Set payment expiration check timeout
var timeoutHandles = {};
Orders.find({status: 'REQUESTED', 'paypal.payKeyExpirationDate': {$exists: true}}).observe({
    added:   function (document) {
        timeoutHandles[document._id] && Meteor.clearTimeout(timeoutHandles[document._id]);
        var delay = Math.max(document.paypal.payKeyExpirationDate.getTime() - (new Date()).getTime(), 0) + 1000;
        Meteor.setTimeout(function(){
            (new Order(document)).updatePaymentDetails();
        }, delay);
    },
    removed: function(document){
        timeoutHandles[document._id] && Meteor.clearTimeout(timeoutHandles[document._id]);
    }
});

// Expire order on payment expiration
Orders.find({'paypal.status': 'EXPIRED', status: {$ne: 'EXPIRED'}}).observe({
    added:   function (document) {
        Orders.update({_id: document._id}, {$set: {status: 'EXPIRED'}});
        _.each(document.items, function(orderItem){
            // transfer items from reserved to available
            Products.update(orderItem.productId, {$inc: {'inventory.reserved': -orderItem.amount, 'inventory.available': orderItem.amount}});
        });
    }
});

// Mark order as PAID on payment
Orders.find({'paypal.status': 'COMPLETED', status: {$ne: 'PAID'}}).observe({
    added:   function (document) {
        Orders.update({_id: document._id}, {$set: {status: 'PAID'}});
        _.each(document.items, function(orderItem){
            // transfer items from reserved to sold
            Products.update(orderItem.productId, {$inc: {'inventory.reserved': -orderItem.amount, 'inventory.sold': orderItem.amount}});
        });
    }
});
