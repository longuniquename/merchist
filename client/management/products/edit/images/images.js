(function(){

    var imageData = {},
        dragging = false,
        shift;

    Template.managementProductsEditImages.rendered = function () {
        var resizeImagesBlock = function () {
            var imagesBlock = this.$('.images');
            imagesBlock.css({
                height: imagesBlock.width()
            });
        };

        $(window).bind('resize', function () {
            resizeImagesBlock();
        });

        resizeImagesBlock();
    };

    Template.managementProductsEditImages.helpers({
        'image': function(){
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

    Template.managementProductsEditImages.events({
        'change #uploadLogoFile': function(e, template){
            e.preventDefault();
            imageData = {};

            template.$('.viewState').hide();
            template.$('.editState').show();

            var reader = new FileReader();
            reader.onload = function (e) {

                var image = new Image();
                image.onload = function () {

                    imageData.file = image;
                    imageData.top = 0;
                    imageData.left = 0;
                    imageData.size = 0;

                    if (image.height < image.width) {
                        imageData.left = Math.ceil((image.width - image.height) / 2);
                        imageData.size = image.height;
                    } else if (image.height > image.width) {
                        imageData.top = Math.ceil((image.height - image.width) / 2);
                        imageData.size = image.width;
                    }

                    drawImage();
                };
                image.src = e.target.result;
            };
            reader.readAsDataURL(e.currentTarget.files[0]);
        },
        'click .saveBtn': function(e, template){
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = imageData.size;
            canvas.height = imageData.size;

            ctx.drawImage(
                imageData.file,
                imageData.left,
                imageData.top,
                imageData.size,
                imageData.size,
                0,
                0,
                imageData.size,
                imageData.size
            );

            Images.insert(canvas.toDataURL(), function (err, fileObj) {
                Products.update(template.data._id, {$set: {imageId: fileObj._id}});
            });

            imageData = {};

            template.$('.editState').hide();
            template.$('.viewState').show();
        },
        'click .cancelBtn': function(e, template){
            imageData = {};

            template.$('.editState').hide();
            template.$('.viewState').show();
        },
        'mousedown #canvas': function(e) {
            dragging = true;
            shift = {x: e.offsetX, y: e.offsetY};

            $(document)
                .attr('unselectable', 'on')
                .css('user-select', 'none')
                .css('-moz-user-select', 'none')
                .css('-khtml-user-select', 'none')
                .css('-webkit-user-select', 'none')
                .on('selectstart', false)
                .on('contextmenu', false)
                .on('keydown', false)
                .on('mousedown', false);
        },
        'mouseup #canvas': function() {
            dragging = false;

            $(document)
                .attr('unselectable', '')
                .css('user-select', '')
                .css('-moz-user-select', '')
                .css('-khtml-user-select', '')
                .css('-webkit-user-select', '')
                .off('selectstart', false)
                .off('contextmenu', false)
                .off('keydown', false)
                .off('mousedown', false);
        },
        'mousemove #canvas': function(e) {
            if (dragging) {

                imageData.left += shift.x - e.offsetX;
                shift.x = e.offsetX;
                imageData.top += shift.y - e.offsetY;
                shift.y = e.offsetY;

                imageData.top = Math.max(0, imageData.top);
                imageData.left = Math.max(0, imageData.left);

                imageData.top = Math.min(imageData.file.height - imageData.size, imageData.top);
                imageData.left = Math.min(imageData.file.width - imageData.size, imageData.left);

                drawImage();
            }
        }
    });

    function drawImage() {

        var canvas = document.getElementById('canvas'),
            $canvas = $('#canvas'),
            ctx = canvas.getContext('2d'),
            dstSize = Math.min($canvas.height(), $canvas.width()) * window.devicePixelRatio;

        canvas.setAttribute('height', dstSize + 'px');
        canvas.setAttribute('width', dstSize + 'px');

        ctx.drawImage(
            imageData.file,
            imageData.left,
            imageData.top,
            imageData.size,
            imageData.size,
            0,
            0,
            dstSize,
            dstSize
        );
    }

})(Template);