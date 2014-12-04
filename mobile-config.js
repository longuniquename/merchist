App.info({
    id:          'com.merchist.client',
    version:     '0.0.12',
    name:        'Merchist',
    description: 'Sell socially!',
    author:      'Mercher, Inc.',
    email:       'contact@mercher.net',
    website:     'http://merchist.meteor.com/'
});

App.icons({
    'android_ldpi':  'icons/android_ldpi.png',
    'android_mdpi':  'icons/android_mdpi.png',
    'android_hdpi':  'icons/android_hdpi.png',
    'android_xhdpi': 'icons/android_xhdpi.png'
});

App.launchScreens({
    'android_ldpi_portrait':   'launch_screens/android_ldpi_portrait.png',
    'android_ldpi_landscape':  'launch_screens/android_ldpi_landscape.png',
    'android_mdpi_portrait':   'launch_screens/android_mdpi_portrait.png',
    'android_mdpi_landscape':  'launch_screens/android_mdpi_landscape.png',
    'android_hdpi_portrait':   'launch_screens/android_hdpi_portrait.png',
    'android_hdpi_landscape':  'launch_screens/android_hdpi_landscape.png',
    'android_xhdpi_portrait':  'launch_screens/android_xhdpi_portrait.png',
    'android_xhdpi_landscape': 'launch_screens/android_xhdpi_landscape.png'
});

App.setPreference('Orientation', 'portrait');
App.setPreference('BackgroundColor', '0xFF3DA3A7');

App.setPreference('SplashScreen', 'screen_patch');

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
    APP_NAME: 'Merchist',
    APP_ID:   '301234113401207'
});
