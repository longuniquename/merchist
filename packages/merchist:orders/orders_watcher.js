// Set status to requested when new order gets payKey
Orders.find({status: 'NEW', 'paypal.payKey': {$exists: true}}).observe({
    added:   function (document) {
        Orders.update({_id: document._id}, {$set: {status: 'REQUESTED'}});
    }
});

// Set payment expiration check timeout
var timeoutHandles = {};
Orders.find({status: 'REQUESTED', 'paypal.payKeyExpirationDate': {$exists: true}}).observe({
    added:   function (document) {
        timeoutHandles[document._id] && Meteor.clearTimeout(timeoutHandles[document._id]);
        var delay = Math.max(document.paypal.payKeyExpirationDate.getTime() - (new Date()).getTime(), 0) + 1000;
        Meteor.setTimeout(function(){
            checkOrderStatus(new Order(document));
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
    }
});

// Mark order as PAID on payment
Orders.find({'paypal.status': 'COMPLETED', status: {$ne: 'PAID'}}).observe({
    added:   function (document) {
        Orders.update({_id: document._id}, {$set: {status: 'PAID'}});
    }
});

var checkOrderStatus = function(order){
    var result = PayPal.AdaptivePayments.PaymentDetails({
        trackingId: order._id
    });

    var modifier = {};

    if (result.payKey) {
        modifier['paypal.payKey'] = result.payKey;
    }

    if (result.status) {
        modifier['paypal.status'] = result.status;
    }

    if (result.currencyCode) {
        modifier['paypal.currencyCode'] = result.currencyCode;
    }

    if (result.trackingId) {
        modifier['paypal.trackingId'] = result.trackingId;
    }

    if (result.actionType) {
        modifier['paypal.actionType'] = result.actionType;
    }

    if (result.feesPayer) {
        modifier['paypal.feesPayer'] = result.feesPayer;
    }

    if (result.reverseAllParallelPaymentsOnError) {
        modifier['paypal.reverseAllParallelPaymentsOnError'] = result.reverseAllParallelPaymentsOnError === 'true';
    }

    if (result.payKeyExpirationDate) {
        modifier['paypal.payKeyExpirationDate'] = new Date(result.payKeyExpirationDate);
    }

    Orders.update({_id: order._id}, {$set: modifier});

    return result.status;
};
