App.info({
    id: 'com.merchist.client',
    name: 'Merchist',
    description: 'Sell socially!',
    author: 'Mercher Inc.',
    email: 'contact@merchist.com',
    website: 'http://merchist.com'
});

App.icons({
    'android_ldpi': 'icons/android/ldpi.png',
    'android_mdpi': 'icons/android/mdpi.png',
    'android_hdpi': 'icons/android/hdpi.png',
    'android_xhdpi': 'icons/android/xhdpi.png'
});

App.launchScreens({
    'android_ldpi_portrait': 'launch_screens/android/ldpi.9.png',
    'android_ldpi_landscape': 'launch_screens/android/ldpi.9.png',
    'android_mdpi_portrait': 'launch_screens/android/mdpi.9.png',
    'android_mdpi_landscape': 'launch_screens/android/mdpi.9.png',
    'android_hdpi_portrait': 'launch_screens/android/hdpi.9.png',
    'android_hdpi_landscape': 'launch_screens/android/hdpi.9.png',
    'android_xhdpi_portrait': 'launch_screens/android/xhdpi.9.png',
    'android_xhdpi_landscape': 'launch_screens/android/xhdpi.9.png'
});

App.setPreference('Orientation', 'portrait');
App.setPreference('BackgroundColor', '0xFF3DA3A7');