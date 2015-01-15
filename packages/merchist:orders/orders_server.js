Orders.deny({
    insert: function () {
        // Order can't be created on client
        return false;
    }
});

Meteor.methods({
    'Orders:createFromProduct': function(product){
        var order = new Order({
            items: [
                {
                    productId: product._id,
                    price: product.price,
                    amount: 1
                }
            ],
            status: 'NEW',
            connectionId: this.connection.id
        });

        if (this.userId) {
            order.userId = this.userId;
        }

        return Orders.findOne(Orders.insert(order));
    }
});

Meteor.publish("orders", function () {
    if (this.userId) {
        return Orders.find({
            $or: [
                {
                    sellerId: this.userId
                },
                {
                    userId: this.userId
                }
            ]
        });
    } else {
        return Orders.find({connectionId: this.connection.id});
    }
});

Meteor.publish('order', function (orderId) {
    if (this.userId) {
        return Orders.find({
            $and: [
                {
                    _id: orderId
                },
                {
                    $or: [
                        {sellerId: this.userId},
                        {userId: this.userId}
                    ]
                }
            ]
        });
    } else {
        return Orders.find({
            _id:          orderId,
            connectionId: this.connection.id
        });
    }
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

    var seller = Meteor.users.findOne(order.sellerId);

    var result;

    try {
        result = PayPal.AdaptivePayments.Pay({
            receiverList:       {
                receiver: [
                    {
                        amount:      order.total(),
                        email:       seller.services.paypal.email,
                        paymentType: 'GOODS',
                        primary:     true
                    },
                    {
                        amount:      Math.ceil(order.total() * 2) / 100,
                        email:       'dmitriy.s.les-facilitator@gmail.com',
                        paymentType: 'SERVICE',
                        primary:     false
                    }
                ]
            },
            trackingId:         order._id,
            ipnNotificationUrl: Meteor.absoluteUrl('_orders/ipn'),
            cancelUrl:          Meteor.absoluteUrl('_orders/pay/close'),
            returnUrl:          Meteor.absoluteUrl('_orders/pay/close')
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
