Package.describe({
    summary: "Facebook API for browser and Cordova with promises",
    version: "0.0.1"
});

Package.onUse(function (api) {
    api.use([
        'tracker',
        'templating',
        'blaze',
        'underscore',
        'mrt:facebook-sdk',
        'mvrx:bluebird'
    ], 'client');

    api.addFiles([
        'fb_client.js',
        'fb_permissions_request_dlg.html',
        'fb_permissions_request_dlg.js'
    ], 'client');
    api.addFiles('fb_browser.js', 'web.browser');
    api.addFiles('fb_cordova.js', 'web.cordova');
    api.addFiles('fb_server.js', 'server');

    api.export('FbApi', 'client');
});

Cordova.depends({
    "com.phonegap.plugins.facebookconnect": "https://github.com/Wizcorp/phonegap-facebook-plugin/tarball/5287cbf9a7a275dcb76477789c3b52b0a5ce0d42"
});
