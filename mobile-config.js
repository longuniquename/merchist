App.info({
    id:          'com.merchist.client',
    version:     '0.1.6',
    name:        'Merchist',
    description: 'Sell socially!',
    author:      'Mercher, Inc.',
    email:       'contact@mercher.net',
    website:     'http://merchist.com/'
});

App.icons({
    'android_ldpi':  'icons/android_ldpi.png',
    'android_mdpi':  'icons/android_mdpi.png',
    'android_hdpi':  'icons/android_hdpi.png',
    'android_xhdpi': 'icons/android_xhdpi.png',
    'iphone':        'icons/ios/iphone.png',
    'iphone_2x':     'icons/ios/iphone_2x.png',
    'iphone_3x':     'icons/ios/iphone_3x.png',
    'ipad':          'icons/ios/ipad.png',
    'ipad_2x':       'icons/ios/ipad_2x.png'
});

App.launchScreens({
    'iphone':                  'launch_screens/ios/iphone.png',
    'iphone_2x':               'launch_screens/ios/iphone_2x.png',
    'iphone5':                 'launch_screens/ios/iphone5.png',
    'iphone6':                 'launch_screens/ios/iphone6.png',
    'iphone6p_portrait':       'launch_screens/ios/iphone6p_portrait.png',
    'iphone6p_landscape':      'launch_screens/ios/iphone6p_landscape.png',
    'ipad_portrait':           'launch_screens/ios/ipad_portrait.png',
    'ipad_portrait_2x':        'launch_screens/ios/ipad_portrait_2x.png',
    'ipad_landscape':          'launch_screens/ios/ipad_landscape.png',
    'ipad_landscape_2x':       'launch_screens/ios/ipad_landscape_2x.png',
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

App.configurePlugin('nl.x-services.plugins.launchmyapp', {
    URL_SCHEME: 'merchist'
});
