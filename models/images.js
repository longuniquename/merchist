var imageStore = new FS.Store.S3("images", {
    region:          "us-west-2",
    accessKeyId:     "AKIAIXL525LMGYUSWYFQ",
    secretAccessKey: "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",
    bucket:          "merchist-staging"
});

Images = new FS.Collection("images", {
    stores: [imageStore],
    filter: {
        maxSize: 3145728,
        allow:   {
            contentTypes: ['image/*'],
            extensions:   ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
        }
    }
});
