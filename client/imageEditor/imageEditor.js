(function () {

    var imageId,
        imageIdDep = new Tracker.Dependency;

    Template.imageEditor.created = function () {

        this.setNewImage = function (dataURL) {
            var template = this,
                $imageEditor = $(this.firstNode);
            $imageEditor.removeClass('initial editing preview');
            $imageEditor.addClass('loading');

            var image = new Image();
            image.onload = function () {

                template.imageData = {};

                template.imageData.image = image;
                template.imageData.top = 0;
                template.imageData.left = 0;
                template.imageData.size = 0;

                if (image.height < image.width) {
                    template.imageData.left = Math.ceil((image.width - image.height) / 2);
                    template.imageData.size = image.height;
                } else if (image.height > image.width) {
                    template.imageData.top = Math.ceil((image.height - image.width) / 2);
                    template.imageData.size = image.width;
                }

                template.drawImage();

                $imageEditor.removeClass('initial loading preview');
                $imageEditor.addClass('editing');
            };
            image.src = dataURL;
        };

        this.drawImage = function () {
            var $canvas = this.$('canvas'),
                canvas = $canvas[0],
                ctx = canvas.getContext('2d'),
                dstSize = Math.min($canvas.height(), $canvas.width()) * window.devicePixelRatio;

            canvas.setAttribute('height', dstSize + 'px');
            canvas.setAttribute('width', dstSize + 'px');

            if (this.imageData && this.imageData.image) {
                ctx.drawImage(
                    this.imageData.image,
                    this.imageData.left,
                    this.imageData.top,
                    this.imageData.size,
                    this.imageData.size,
                    0,
                    0,
                    dstSize,
                    dstSize
                );
            }
        };

        this.saveImage = function () {
            var template = this,
                $imageEditor = $(this.firstNode);

            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = template.imageData.size;
            canvas.height = template.imageData.size;

            ctx.drawImage(
                template.imageData.image,
                template.imageData.left,
                template.imageData.top,
                template.imageData.size,
                template.imageData.size,
                0,
                0,
                template.imageData.size,
                template.imageData.size
            );

            Images.insert(canvas.toDataURL('image/png'), function (err, fileObj) {
                if (!err) {

                    $imageEditor.removeClass('initial loading editing');
                    $imageEditor.addClass('preview');

                    if (!template.data) {
                        template.data = {}
                    }

                    imageId = fileObj._id;
                    imageIdDep.changed();
                }
            });
        }
    };

    Template.imageEditor.rendered = function () {
        var template = this,
            $imageEditor = $(this.firstNode);

        $imageEditor.mutate('width', function () {
            $imageEditor.css({
                height: $imageEditor.width()
            });
            template.drawImage();
        });
        $imageEditor.removeClass('loading editing preview');
        $imageEditor.addClass('initial');
    };

    Template.imageEditor.helpers({
        showCameraButton: function(){
            return Meteor.isCordova
        },
        image: function(){
            imageIdDep.depend();
            if (imageId) {
                Meteor.subscribe("image", imageId);
                return Images.findOne(imageId);
            }
        }
    });

    Template.imageEditor.events({
        'click .uploadBtn':                     function (e, template) {

            var $fileInput = template.$('.uploadBtn input[type="file"]');

            if (!$fileInput.length) {
                $fileInput = $('<input type="file" accept="image/*" />');
                $fileInput.css({
                    opacity: 0,
                    display: 'block',
                    height:  0,
                    width:   0
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

            var $imageEditor = $(Template.instance().firstNode);
            $imageEditor.removeClass('initial editing preview');
            $imageEditor.addClass('loading');

            var reader = new FileReader();
            reader.onload = function (e) {
                template.setNewImage(e.target.result);
            };
            reader.readAsDataURL(e.currentTarget.files[0]);
        },
        'click .cameraBtn': function (e, template) {
            e.preventDefault();
            if (Meteor.isCordova) {
                navigator.camera.getPicture(
                    function(imageData){
                        template.setNewImage("data:image/jpeg;base64," + imageData);
                    },
                    function(message){
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
        },
        'click .saveBtn': function (e, template) {
            e.preventDefault();
            template.saveImage();
        }
    });

})(Template);
