var imageStore = new FS.Store.S3("images", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging"
});

Images = new FS.Collection("images", {
    stores: [imageStore],
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
