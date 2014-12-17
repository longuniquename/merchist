var imageStore = new FS.Store.S3("images");

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
