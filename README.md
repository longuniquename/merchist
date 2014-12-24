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

Deploy to AWS Elastic Beanstalk
=============
```bash
cd ~/work/mercher-inc/merchist
rm -rf ../.dist
meteor build ../.dist --server http://staging-merchist.elasticbeanstalk.com/ --architecture os.linux.x86_64
cd ../.dist
tar -zxvf merchist.tar.gz
rm merchist.tar.gz
cd bundle/
node -e "require('fs').writeFileSync('./package.json',JSON.stringify({dependencies:JSON.parse(require('fs').readFileSync('./programs/server/package.json')).dependencies,scripts:{start:'node main.js'}}, null, \"\\t\"));"
mkdir .elasticbeanstalk
printf "branch-defaults:\n  default:\n    environment: staging" >> .elasticbeanstalk/config.yml
eb init Merchist --region us-west-2
eb create staging -c staging-merchist -d
eb deploy
```

Building mobile apps
====================
```bash
meteor build ../release --server=http://merchist.com
jarsigner -sigalg SHA1withRSA -digestalg SHA1 ../release/android/unaligned.apk Merchist
~/.meteor/android_bundle/android-sdk/build-tools/21.0.0/zipalign -v 4 ../release/android/unaligned.apk ../release/android/production.apk
```

