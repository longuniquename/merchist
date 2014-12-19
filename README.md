Merchist
========

Deploy to Meteor.com
====================
```bash
cd ~/work/mercher-inc/merchist
meteor build --server http://merchist.meteor.com/ --directory ~/work/mercher-inc/merchist_build
meteor deploy merchist.meteor.com
cd ~/work/mercher-inc/merchist_build/android/
jarsigner -digestalg SHA1 unaligned.apk Merchist
~/.meteor/android_bundle/android-sdk/build-tools/20.0.0/zipalign 4 unaligned.apk production.apk
```

Deploy to AWS
=============
```bash
cd ~/work/mercher-inc/merchist
rm -rf ../.dist
meteor build ../.dist --server http://staging-merchist.elasticbeanstalk.com/ --architecture os.linux.x86_64
cd ../.dist
tar -zxvf merchist.tar.gz
cd bundle/
node -e "require('fs').writeFileSync('./package.json',JSON.stringify({dependencies:JSON.parse(require('fs').readFileSync('./programs/server/package.json')).dependencies,scripts:{start:'node main.js'}}, null, \"\\t\"));"
eb init Merchist --region us-west-2
eb create staging -c staging-merchist -d
```
