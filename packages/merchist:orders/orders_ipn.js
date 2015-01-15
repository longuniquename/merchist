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
                new Fiber(function () {
                    Orders.update({_id:  ipnMessageData["tracking_id"],
                        'paypal.payKey': ipnMessageData["pay_key"]
                    }, {$set: {status: ipnMessageData['status']}});
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
