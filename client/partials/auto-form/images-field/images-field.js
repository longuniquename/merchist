(function () {

    function ImagesList(images) {
        this._dep = new Tracker.Dependency;
        this.set(images);
    }

    ImagesList.prototype.get = function () {
        this._dep.depend();
        return this._images;
    };

    ImagesList.prototype.toIds = function () {
        this._dep.depend();
        return _.map(this._images, function (image) {
            return image._id;
        });
    };

    ImagesList.prototype.set = function (images) {
        if (EJSON.equals(this._images, images))
            return;

        check(images, [FS.File]);
        this._images = images;
        this._dep.changed();
    };

    ImagesList.prototype.add = function (image) {
        check(image, FS.File);
        this._images.push(image);
        Meteor.subscribe('image', image._id);
        this._dep.changed();
    };

    var getDataUrl = function (blob) {
        var reader = new FileReader();
        return new Promise(function (resolve, reject) {
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(blob);
        });
    };

    var cropImage = function (dataUrl) {
        var image = new Image(),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            cropData = {};
        return new Promise(function (resolve, reject) {
            image.onload = function () {
                cropData.top = 0;
                cropData.left = 0;
                cropData.size = 0;

                if (image.height < image.width) {
                    cropData.left = Math.ceil((image.width - image.height) / 2);
                    cropData.size = image.height;
                } else if (image.height > image.width) {
                    cropData.top = Math.ceil((image.height - image.width) / 2);
                    cropData.size = image.width;
                }

                canvas.width = cropData.size;
                canvas.height = cropData.size;

                ctx.drawImage(
                    image,
                    cropData.left,
                    cropData.top,
                    cropData.size,
                    cropData.size,
                    0,
                    0,
                    cropData.size,
                    cropData.size
                );

                resolve(canvas.toDataURL('image/png'));
            };
            image.src = dataUrl;
        });
    };

    Template.mcInputImages.helpers({
        images:           function () {
            //return this.value.get();
            return Images.find({_id: {$in: this.value.toIds()}});
        },
        isReady:          function (store) {
            return this.isUploaded() && this.hasStored(store);
        },
        showCameraButton: function () {
            return Meteor.isCordova
        }
    });

    Template.mcInputImages.events({
        'click .uploadBtn':                     function (e, template) {
            var $fileInput = template.$('.uploadBtn input[type="file"]');

            if (!$fileInput.length) {
                $fileInput = $('<input />');
                $fileInput.attr({
                    type:   'file',
                    accept: 'image/*'
                });
                $fileInput.prop({
                    multiple: true
                });
                $fileInput.css({
                    opacity:  0,
                    display:  'block',
                    height:   0,
                    width:    0,
                    position: 'absolute',
                    top:      -9999,
                    left:     -9999
                });
                $fileInput.appendTo(template.$('.uploadBtn'));
            }

            if (e.target !== $fileInput[0]) {
                e.preventDefault();
                $fileInput.click();
            }
        },
        'change .uploadBtn input[type="file"]': function (e, template) {
            e.preventDefault();
            var $fileInput = template.$('.uploadBtn input[type="file"]');
            $fileInput.remove();

            _.each(e.currentTarget.files, function (file) {

                var fileName = file.name;

                getDataUrl(file)
                    .then(function (dataUrl) {
                        return cropImage(dataUrl);
                    })
                    .then(function (dataUrl) {
                        var newFile = new FS.File(dataUrl);
                        newFile.userId = Meteor.userId();
                        newFile.name(fileName);
                        newFile.extension('png');

                        Images.insert(newFile, function (err, fileObj) {
                            if (!err) {
                                template.data.value.add(fileObj);
                            } else {
                                alert(err);
                            }
                        });
                    });
            });
        },
        'click .cameraBtn':                     function (e, template) {
            e.preventDefault();
            if (Meteor.isCordova) {
                navigator.camera.getPicture(
                    function (imageData) {

                        var dataUrl = "data:image/jpeg;base64," + imageData;

                        cropImage(dataUrl)
                            .then(function (dataUrl) {

                                var newFile = new FS.File(dataUrl);
                                newFile.userId = Meteor.userId();
                                newFile.name('cam.png');

                                Images.insert(newFile, function (err, fileObj) {
                                    if (!err) {
                                        template.data.value.add(fileObj);
                                    } else {
                                        alert(err);
                                    }
                                });
                            });
                    },
                    function (message) {
                        alert('Failed because: ' + message);
                    },
                    {
                        quality:            100,
                        sourceType:         Camera.PictureSourceType.CAMERA,
                        destinationType:    Camera.DestinationType.DATA_URL,
                        encodingType:       Camera.EncodingType.JPEG,
                        cameraDirection:    Camera.Direction.BACK,
                        mediaType:          Camera.MediaType.PICTURE,
                        saveToPhotoAlbum:   false,
                        correctOrientation: true
                    }
                );
            }
        }
    });

    AutoForm.addInputType('mcImages', {
        template: 'mcInputImages',
        valueIn:  function (value) {
            if (!value) {
                value = [];
            }
            check(value, [String]);
            return new ImagesList(Images.find({_id: {$in: value}}).fetch());
        },
        valueOut: function () {
            return Blaze.getData(this[0]).value.toIds();
        }
    });

})();
