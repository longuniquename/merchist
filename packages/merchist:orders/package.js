Package.describe({
    summary: "Orders package",
    version: "0.0.0"
});

Package.onUse(function (api) {
    api.use('mongo');
    api.use('ejson');
    api.use('webapp', 'server');
    api.use('aldeed:collection2');
    api.use('merchist:paypal');

    api.addFiles('orders_common.js');
    api.addFiles('orders_server.js', 'server');
    api.addFiles('orders_client.js', 'client');
    api.export('Order');
    api.export('Orders');
});
