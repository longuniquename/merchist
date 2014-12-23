var oStore = new FS.Store.S3("o");
var xsStore = new FS.Store.S3("xs");
var sStore = new FS.Store.S3("s");
var mStore = new FS.Store.S3("m");
var lStore = new FS.Store.S3("l");
var xlStore = new FS.Store.S3("xl");

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
