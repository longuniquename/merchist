#!/usr/bin/env node

var rootdir = process.argv[2],
    fs      = require('fs'),
    path    = require('path'),
    xml2js  = require('xml2js'),
    _       = require('underscore');

var configPath = path.join(rootdir, '/platforms/android/res/xml/config.xml');

var parser  = new xml2js.Parser(),
    builder = new xml2js.Builder();

fs.readFile(configPath, function (err, data) {
    parser.parseString(data, function (err, result) {
        var feature = result.widget.feature;

        feature.push({
            '$':   {
                name: "WebIntent"
            },
            param: [
                {
                    '$': {
                        name:  "android-package",
                        value: "com.borismus.webintent.WebIntent"
                    }
                }
            ]
        });

        var data = builder.buildObject(result);

        fs.writeFile(configPath, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Done');
            }
        });
    });
});
