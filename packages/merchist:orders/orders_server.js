Orders.deny({
    insert: function (userId, doc) {
        //Initial status of order should be 'new'
        if (doc.status !== 'new') {
            return true;
        }

        //Can't create orders for other users
        if ((doc.userId || Meteor.userId()) && doc.userId !== Meteor.userId()) {
            return true;
        }

        return false;
    }
});

Meteor.publish("orders", function () {
    return Orders.find();
});

WebApp.connectHandlers.use("/_orders/pay/close", function (req, res, next) {
    res.statusCode = 200;
    res.end('<!DOCTYPE html><html><head><script>window.close();</script></head><body></body></html>');
});

WebApp.connectHandlers.use("/_orders/pay", function (req, res, next) {

    check(req.query.orderId, String);

    var config = ServiceConfiguration.configurations.findOne({service: 'paypal'});
    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }

    var order = Orders.findOne(req.query.orderId);

    if (!order) {
        res.statusCode = 404;
        res.end();
        return;
    }

    if (order.paypal && order.paypal.payKey) {
        res.statusCode = 302;
        res.setHeader("Location", (config.sandbox ? 'https://sandbox.paypal.com/' : 'https://www.paypal.com/') + 'cgi-bin/webscr?cmd=_ap-payment&paykey=' + order.paypal.payKey);
        res.end();
        return;
    }

    var seller = Meteor.users.findOne(order.sellerId());

    var result;

    try {
        result = PayPal.AdaptivePayments.Pay({
            receiverList: {
                receiver: [
                    {
                        amount: order.total(),
                        email: seller.services.paypal.email,
                        paymentType: 'GOODS',
                        primary: true
                    },
                    {
                        amount: Math.ceil(order.total() * 2) / 100,
                        email: 'dmitriy.s.les-facilitator@gmail.com',
                        paymentType: 'SERVICE',
                        primary: false
                    }
                ]
            },
            trackingId: order._id,
            cancelUrl: Meteor.absoluteUrl('_orders/pay/close'),
            returnUrl: Meteor.absoluteUrl('_orders/pay/close')
        });
    } catch (err) {
        console.error(err);
        throw new Meteor.Error('paypal-error');
    }

    if (result.payKey) {
        Orders.update(order, {$set: {'paypal.payKey': result.payKey}});

        res.statusCode = 302;
        res.setHeader("Location", (config.sandbox ? 'https://sandbox.paypal.com/' : 'https://www.paypal.com/') + 'cgi-bin/webscr?cmd=_ap-payment&paykey=' + result.payKey);
        res.end();
        return;
    }

    res.statusCode = 500;
    res.end();
});
