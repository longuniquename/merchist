var path = Npm.require('path');

process.env.CLOUD_DIR = process.env.CLOUD_DIR || '../uploads';

var oStore = new FS.Store.FileSystem("o", {
    path: path.join(process.env.CLOUD_DIR, 'images'),
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "o", save: false});
        fileObj.name('o.png', {store: "o", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).stream('PNG').pipe(writeStream);
    }
});

var xsStore = new FS.Store.FileSystem("xs", {
    path: path.join(process.env.CLOUD_DIR, 'images'),
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "xs", save: false});
        fileObj.name('xs.png', {store: "xs", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(100).stream('PNG').pipe(writeStream);
    }
});

var sStore = new FS.Store.FileSystem("s", {
    path: path.join(process.env.CLOUD_DIR, 'images'),
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "s", save: false});
        fileObj.name('s.png', {store: "s", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(200).stream('PNG').pipe(writeStream);
    }
});

var mStore = new FS.Store.FileSystem("m", {
    path: path.join(process.env.CLOUD_DIR, 'images'),
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "m", save: false});
        fileObj.name('m.png', {store: "m", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(400).stream('PNG').pipe(writeStream);
    }
});

var lStore = new FS.Store.FileSystem("l", {
    path: path.join(process.env.CLOUD_DIR, 'images'),
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "l", save: false});
        fileObj.name('l.png', {store: "l", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(800).stream('PNG').pipe(writeStream);
    }
});

var xlStore = new FS.Store.FileSystem("xl", {
    path: path.join(process.env.CLOUD_DIR, 'images'),
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "xl", save: false});
        fileObj.name('xl.png', {store: "xl", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(1600).stream('PNG').pipe(writeStream);
    }
});

Images = new FS.Collection("images", {
    stores: [oStore, xsStore, sStore, mStore, lStore, xlStore],
    filter: {
        maxSize: 1024 * 1024 * 10,
        allow:   {
            contentTypes: ['image/*'],
            extensions:   ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
        }
    }
});

Meteor.publish('images', function () {
    return Images.find();
});

Meteor.publish('image', function (imageId) {
    return Images.find({_id: imageId});
});

Meteor.publish('myImages', function () {
    return Images.find({userId: this.userId});
});

Meteor.publish('productImages', function (productId) {
    var product = Products.findOne(productId);
    if (product && product.imageIds && product.imageIds.length) {
        return Images.find({_id: {$in: product.imageIds}});
    }
    this.ready();
});
