Package.describe({
    summary: "OpenGraph support",
    version: "0.0.0"
});

Package.onUse(function (api) {
    api.use(['tracker', 'jquery', 'underscore'], 'client');
    api.use('iron:router', 'client', {weak: true});

    api.addFiles("og_client.js", 'client');
    api.export('OgMeta', 'client');
});
