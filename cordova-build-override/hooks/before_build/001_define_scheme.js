#!/usr/bin/env node

var rootdir = process.argv[2],
    fs      = require('fs'),
    path    = require('path'),
    xml2js  = require('xml2js'),
    _       = require('underscore');

var manifestPath = path.join(rootdir, '/platforms/android/AndroidManifest.xml');

var parser  = new xml2js.Parser(),
    builder = new xml2js.Builder();

var schemeIntentFilter = {
    action:   [
        {
            '$': {
                'android:name': "android.intent.action.VIEW"
            }
        }
    ],
    category: [
        {
            '$': {
                'android:name': "android.intent.category.DEFAULT"
            }
        }
    ],
    data:     [
        {
            '$': {
                'android:scheme': 'merchist'
            }
        }
    ]
};

var browsableIntentFilter = {
    action:   [
        {
            '$': {
                'android:name': "android.intent.action.VIEW"
            }
        }
    ],
    category: [
        {
            '$': {
                'android:name': "android.intent.category.DEFAULT"
            }
        },
        {
            '$': {
                'android:name': "android.intent.category.BROWSABLE"
            }
        }
    ],
    data:     [
        {
            '$': {
                'android:scheme': 'http',
                'android:host':   'merchist.meteor.com'
            }
        }
    ]
};

var sendImagesIntentFilter = {
    action:   [
        {
            '$': {
                'android:name': "android.intent.action.SEND"
            }
        },
        {
            '$': {
                'android:name': "android.intent.action.SEND_MULTIPLE"
            }
        }
    ],
    category: [
        {
            '$': {
                'android:name': "android.intent.category.DEFAULT"
            }
        }
    ],
    data:     [
        {
            '$': {
                'android:mimeType': 'image/*'
            }
        }
    ]
};

fs.readFile(manifestPath, function (err, data) {
    parser.parseString(data, function (err, result) {
        var activities = result.manifest.application[0].activity;
        var mainActivity = _.find(activities, function (activity) {
            return activity['$']['android:name'] === 'Merchist';
        });
        mainActivity['intent-filter'].push(schemeIntentFilter);
        mainActivity['intent-filter'].push(browsableIntentFilter);
        mainActivity['intent-filter'].push(sendImagesIntentFilter);

        var data = builder.buildObject(result);

        fs.writeFile(manifestPath, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Done');
            }
        });
    });
});
