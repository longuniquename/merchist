Package.describe({
    summary: "PayPal SDK",
    version: "0.0.0"
});

Package.onUse(function (api) {
    api.use('oauth2');
    api.use('oauth');
    api.use('http', 'server');
    api.use('webapp', 'server');
    api.use('underscore');
    api.use('random', 'client');
    api.use('service-configuration');

    api.addFiles('paypal_common.js');
    api.addFiles('paypal_server.js', 'server');
    api.addFiles('paypal_client.js', 'client');

    api.export('PayPal');
});
