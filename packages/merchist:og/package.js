Package.describe({
    summary: "OpenGraph support",
    version: "0.0.0"
});

Package.onUse(function(api) {
    api.use('tracker', 'client');
    api.use('jquery', 'client');
    api.use('underscore', 'client');

    api.addFiles("og_client.js", 'client');

    api.export('OgMeta', 'client');
});
