Merchist
========

Deploy
======
```
cd ~/work/mercher-inc/merchist
meteor deploy merchist.meteor.com
meteor build --server http://merchist.meteor.com/ --directory ~/work/mercher-inc/merchist_build
cd ~/work/mercher-inc/merchist_build/android/
jarsigner -digestalg SHA1 unaligned.apk Merchist
~/.meteor/android_bundle/android-sdk/build-tools/20.0.0/zipalign 4 unaligned.apk production.apk
```
