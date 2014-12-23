var imageStore = new FS.Store.S3("images");
var thumbsStore = new FS.Store.S3("thumbs");

Images = new FS.Collection("images", {
    stores: [imageStore, thumbsStore],
    filter: {
        maxSize: 1024 * 1024 * 10,
        allow:   {
            contentTypes: ['image/*'],
            extensions:   ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
        }
    }
});
