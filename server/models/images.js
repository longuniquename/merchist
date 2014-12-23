var oStore = new FS.Store.S3("o", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging",
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "o", save: false});
        fileObj.name('o.png', {store: "o", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).stream('PNG').pipe(writeStream);
    }
});

var xsStore = new FS.Store.S3("xs", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging",
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "xs", save: false});
        fileObj.name('xs.png', {store: "xs", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(100).stream('PNG').pipe(writeStream);
    }
});

var sStore = new FS.Store.S3("s", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging",
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "s", save: false});
        fileObj.name('s.png', {store: "s", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(200).stream('PNG').pipe(writeStream);
    }
});

var mStore = new FS.Store.S3("m", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging",
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "m", save: false});
        fileObj.name('m.png', {store: "m", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(400).stream('PNG').pipe(writeStream);
    }
});

var lStore = new FS.Store.S3("l", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging",
    beforeWrite:     function (fileObj) {
        fileObj.type('image/png', {store: "l", save: false});
        fileObj.name('l.png', {store: "l", save: false});
    },
    transformWrite:  function (fileObj, readStream, writeStream) {
        gm(readStream).resize(800).stream('PNG').pipe(writeStream);
    }
});

var xlStore = new FS.Store.S3("xl", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging",
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
