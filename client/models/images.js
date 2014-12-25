var oStore = new FS.Store.FileSystem("o");
var xsStore = new FS.Store.FileSystem("xs");
var sStore = new FS.Store.FileSystem("s");
var mStore = new FS.Store.FileSystem("m");
var lStore = new FS.Store.FileSystem("l");
var xlStore = new FS.Store.FileSystem("xl");

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
