var bodyParser = Npm.require('body-parser'),
    qs = Npm.require('querystring'),
    https = Npm.require('https'),
    Fiber = Npm.require('fibers');

WebApp.connectHandlers.use('/_orders/ipn', bodyParser.raw({type: 'application/*'}));

WebApp.connectHandlers.use('/_orders/ipn', function (req, res, next) {
    res.writeHead(200);
    res.end();

    var ipnMessage = 'cmd=_notify-validate&' + req.body.toString(),
        ipnMessageData = qs.parse(req.body.toString());

    var payPalRequest = https.request({
        host:    ipnMessageData['test_ipn'] ? 'www.sandbox.paypal.com' : 'www.paypal.com',
        method:  'POST',
        path:    '/cgi-bin/webscr',
        headers: {'Content-Length': ipnMessage.length}
    }, function (payPalResponse) {
        payPalResponse.on('data', function (d) {
            if (d.toString() === 'VERIFIED') {
                var paymentInfo = {
                    payKey: ipnMessageData["pay_key"],
                    status: ipnMessageData['status']
                };

                if (ipnMessageData["transaction_type"]) {
                    paymentInfo.transactionType = ipnMessageData["transaction_type"];
                }

                if (ipnMessageData["sender_email"]) {
                    paymentInfo.senderEmail = ipnMessageData["sender_email"];
                }

                if (ipnMessageData["action_type"]) {
                    paymentInfo.actionType = ipnMessageData["action_type"];
                }

                if (ipnMessageData["payment_request_date"]) {
                    paymentInfo.paymentRequestDate = new Date(ipnMessageData["payment_request_date"]);
                }

                if (ipnMessageData["reverse_all_parallel_payments_on_error"]) {
                    paymentInfo.reverseAllParallelPaymentsOnError = ipnMessageData["reverse_all_parallel_payments_on_error"] === 'true';
                }

                if (ipnMessageData["return_url"]) {
                    paymentInfo.returnUrl = ipnMessageData["return_url"];
                }

                if (ipnMessageData["cancel_url"]) {
                    paymentInfo.cancelUrl = ipnMessageData["cancel_url"];
                }

                if (ipnMessageData["ipn_notification_url"]) {
                    paymentInfo.ipnNotificationUrl = ipnMessageData["ipn_notification_url"];
                }

                if (ipnMessageData["memo"]) {
                    paymentInfo.memo = ipnMessageData["memo"];
                }

                if (ipnMessageData["fees_payer"]) {
                    paymentInfo.feesPayer = ipnMessageData["fees_payer"];
                }

                if (ipnMessageData["trackingId"]) {
                    paymentInfo.trackingId = ipnMessageData["trackingId"];
                }

                if (ipnMessageData["preapproval_key"]) {
                    paymentInfo.preapprovalKey = ipnMessageData["preapproval_key"];
                }

                if (ipnMessageData["reason_code"]) {
                    paymentInfo.reasonCode = ipnMessageData["reason_code"];
                }

                if (ipnMessageData["transaction_type"]) {
                    paymentInfo.transactionType = ipnMessageData["transaction_type"];
                }

                new Fiber(function () {
                    Orders.update(
                        {
                            'paypal.payKey': ipnMessageData["pay_key"]
                        },
                        {
                            $set: {
                                paypal: paymentInfo
                            }
                        }
                    );
                }).run();
            } else {
                console.warn(ipnMessageData);
            }
        });
    });

    payPalRequest.write(ipnMessage);
    payPalRequest.end();
    payPalRequest.on('error', function (e) {
        console.error(e);
    });
});
