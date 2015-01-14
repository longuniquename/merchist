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

    api.addFiles([
        'order_model.js',
        'orders_collection.js',
        'orders_schema.js',
        'orders_common.js'
    ]);

    api.addFiles('orders_server.js', 'server');
    api.addFiles('orders_client.js', 'web');
    api.addFiles('orders_browser.js', 'web.browser');
    api.addFiles('orders_cordova.js', 'web.cordova');

    api.export('Order');
    api.export('Orders');
});

Cordova.depends({
    'org.apache.cordova.inappbrowser': '0.5.1'
});
