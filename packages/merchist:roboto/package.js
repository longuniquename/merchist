Package.describe({
    name:    "merchist:roboto",
    summary: "Adds Roboto font to the project",
    version: "0.0.0"
});

Package.onUse(function (api) {
    api.addFiles('merchist_roboto_browser.js', 'web.browser');

    api.use('less', 'web.cordova');
    api.addFiles(
        [
            'merchist_roboto_cordova.less',
            'fonts/Roboto-Thin.ttf',
            'fonts/Roboto-Light.ttf',
            'fonts/Roboto-Regular.ttf',
            'fonts/Roboto-Medium.ttf',
            'fonts/Roboto-Bold.ttf',
            'fonts/Roboto-Black.ttf',
            'fonts/Roboto-ThinItalic.ttf',
            'fonts/Roboto-LightItalic.ttf',
            'fonts/Roboto-Italic.ttf',
            'fonts/Roboto-MediumItalic.ttf',
            'fonts/Roboto-BoldItalic.ttf',
            'fonts/Roboto-BlackItalic.ttf'
        ],
        'web.cordova'
    );
});
