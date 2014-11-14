Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "../uploads"})],
    filter: {
        maxSize: 3145728,
        allow: {
            contentTypes: ['image/*'],
            extensions: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
        }
    }
});