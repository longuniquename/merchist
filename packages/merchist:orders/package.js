Package.describe({
    summary: "Orders package",
    version: "0.0.0"
});

Package.onUse(function (api) {
    api.use('mongo');
    api.use('ejson');
    api.use('aldeed:collection2');

    api.addFiles('orders_common.js');
    api.addFiles('orders_server.js', 'server');
    api.export('Order');
    api.export('Orders');
});
