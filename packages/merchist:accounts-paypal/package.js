Package.describe({
    summary: "Login service for PayPal accounts",
    version: "0.0.0"
});

Package.onUse(function(api) {
    api.use('accounts-base');
    api.imply('accounts-base');
    api.use('accounts-oauth');
    api.use('merchist:paypal');
    api.imply('merchist:paypal');

    api.addFiles("paypal_common.js");
});
