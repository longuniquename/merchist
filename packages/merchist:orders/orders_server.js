Orders.deny({
    insert: function () {
        // Order can't be created on client
        return false;
    }
});

Meteor.methods({
    'Orders:createFromProduct':    function (product) {
        var order = new Order({
            items:        [
                {
                    productId: product._id,
                    price:     product.price,
                    amount:    1
                }
            ],
            connectionId: this.connection.id
        });

        if (this.userId) {
            order.userId = this.userId;
        }

        return Orders.insert(order);
    },
    'Orders:getPayUrl':            function (orderId) {
        var order = Orders.findOne(orderId);

        if (!order) {
            throw new Meteor.Error('not-found', 'Order was not found');
        }

        var config = ServiceConfiguration.configurations.findOne({service: 'paypal'});
        if (!config) {
            throw new ServiceConfiguration.ConfigError();
        }

        if (order.paypal && order.paypal.payKey) {
            return (config.sandbox ? 'https://sandbox.paypal.com/' : 'https://www.paypal.com/') + 'webapps/adaptivepayment/flow/pay?paykey=' + order.paypal.payKey;
        }

        var seller = Meteor.users.findOne(order.sellerId);

        var result = PayPal.AdaptivePayments.Pay({
            trackingId:                        order._id,
            actionType:                        'CREATE',
            currencyCode:                      'USD',
            feesPayer:                         'PRIMARYRECEIVER',
            payKeyDuration:                    'PT15M',
            reverseAllParallelPaymentsOnError: true,
            receiverList:                      {
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
            ipnNotificationUrl:                Meteor.absoluteUrl('_orders/ipn'),
            cancelUrl:                         Meteor.absoluteUrl('_orders/pay/close'),
            returnUrl:                         Meteor.absoluteUrl('_orders/pay/close'),
            clientDetails:                     {
                applicationId: 'Merchist',
                partnerName:   'Mercher, Inc.'
            }
        });

        if (!result.payKey) {
            return null;
        }

        Orders.update({_id: order._id}, {
            $set: {
                paypal: {
                    payKey: result.payKey,
                    status: result.paymentExecStatus
                }
            }
        });

        var setPaymentOptionsRequest = {
            payKey:          result.payKey,
            senderOptions:   {
                requireShippingAddressSelection: true
            },
            receiverOptions: {
                invoiceData: {
                    item:          [],
                    totalTax:      0,
                    totalShipping: 0
                },
                receiver:    {
                    email: seller.services.paypal.email
                }
            }
        };

        _.each(order.items, function (orderItem) {
            var product = Products.findOne(orderItem.productId);
            setPaymentOptionsRequest.receiverOptions.invoiceData.item.push({
                identifier: product._id,
                name:       product.title,
                itemPrice:  product.price,
                itemCount:  orderItem.amount,
                price:      product.price * orderItem.amount
            });
        });

        PayPal.AdaptivePayments.SetPaymentOptions(setPaymentOptionsRequest);

        var paymentDetailsResult;

        try {
            paymentDetailsResult = PayPal.AdaptivePayments.PaymentDetails({
                payKey: result.payKey
            });
        } catch (err) {
            console.error(err);
            throw new Meteor.Error('paypal-error');
        }

        var paymentInfo = {};

        if (paymentDetailsResult["actionType"]) {
            paymentInfo['paypal.actionType'] = paymentDetailsResult["actionType"];
        }

        if (paymentDetailsResult["currencyCode"]) {
            paymentInfo['paypal.currencyCode'] = paymentDetailsResult["currencyCode"];
        }

        if (paymentDetailsResult["feesPayer"]) {
            paymentInfo['paypal.feesPayer'] = paymentDetailsResult["feesPayer"];
        }

        if (paymentDetailsResult["memo"]) {
            paymentInfo['paypal.memo'] = paymentDetailsResult["memo"];
        }

        if (paymentDetailsResult["payKey"]) {
            paymentInfo['paypal.payKey'] = paymentDetailsResult["payKey"];
        }

        if (paymentDetailsResult["payKeyExpirationDate"]) {
            paymentInfo['paypal.payKeyExpirationDate'] = new Date(paymentDetailsResult["payKeyExpirationDate"]);
        }

        if (paymentDetailsResult["reverseAllParallelPaymentsOnError"]) {
            paymentInfo['paypal.reverseAllParallelPaymentsOnError'] = paymentDetailsResult["reverseAllParallelPaymentsOnError"] === 'true';
        }

        if (paymentDetailsResult["status"]) {
            paymentInfo['paypal.status'] = paymentDetailsResult["status"];
        }

        if (paymentDetailsResult["trackingId"]) {
            paymentInfo['paypal.trackingId'] = paymentDetailsResult["trackingId"];
        }

        Orders.update({'paypal.payKey': result.payKey}, {$set: paymentInfo});

        return (config.sandbox ? 'https://sandbox.paypal.com/' : 'https://www.paypal.com/') + 'webapps/adaptivepayment/flow/pay?paykey=' + result.payKey;
    },
    'Orders:updatePaymentDetails': function (orderId) {
        var order = Orders.findOne(orderId);

        if (!order) {
            throw new Meteor.Error('not-found', 'Order was not found');
        }

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
            trackingId:                        order._id,
            actionType:                        'CREATE',
            currencyCode:                      'USD',
            feesPayer:                         'PRIMARYRECEIVER',
            payKeyDuration:                    'PT15M',
            reverseAllParallelPaymentsOnError: true,
            receiverList:                      {
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
            ipnNotificationUrl:                Meteor.absoluteUrl('_orders/ipn'),
            cancelUrl:                         Meteor.absoluteUrl('_orders/pay/close'),
            returnUrl:                         Meteor.absoluteUrl('_orders/pay/close'),
            clientDetails:                     {
                applicationId: 'Merchist',
                partnerName:   'Mercher, Inc.'
            }
        });
    } catch (err) {
        console.error(err);
        throw new Meteor.Error('paypal-error');
    }

    if (result.payKey) {
        Orders.update(order, {
            $set: {
                paypal: {
                    payKey: result.payKey,
                    status: result.paymentExecStatus
                }
            }
        });

        res.statusCode = 302;
        res.setHeader("Location", (config.sandbox ? 'https://sandbox.paypal.com/' : 'https://www.paypal.com/') + 'cgi-bin/webscr?cmd=_ap-payment&paykey=' + result.payKey);
        res.end();
        return;
    }

    res.statusCode = 500;
    res.end();
});
