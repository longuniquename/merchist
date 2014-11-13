(function(){

    function loadFile(file) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            reader.onerror = function(e) {
                reject();
            };
            reader.readAsDataURL(file);
        });
    }

    function loadImage(src) {
        return new Promise(function(resolve, reject) {
            var image = new Image();
            image.onload = function() {
                resolve(image);
            };
            image.src = src;
        });
    }

    Template.shopEdit.rendered = function(){
        var resizeImagesBlock = function(){
            var imagesBlock = this.$('.imagesBlock');
            imagesBlock.css({
                height: imagesBlock.width()
            });
        };

        $(window).bind('resize', function(){
            resizeImagesBlock();
        });

        resizeImagesBlock();
    };

    Template.shopEdit.events({
        'submit .shopEditForm': function (e) {
            e.preventDefault();

            var data = {
                title: $('input[name="title"]', e.currentTarget).val(),
                subtitle: $('input[name="subtitle"]', e.currentTarget).val(),
                description: $('textarea[name="description"]', e.currentTarget).val()
            };

            if (!this._id) {
                Router.go('shops.edit', {shopId: Shops.insert(data)});
            } else {
                Shops.update(this._id, {$set: data});
            }
        },
        'change #uploadLogoFile': function (e, template) {
            template.$('.uploadMenu').toggle();
            template.data.logo = {};

            loadFile(e.currentTarget.files[0])
                .then(function(dataUrl){
                    return loadImage(dataUrl);
                })
                .then(function(image){
                    var srcTop = 0,
                        srcLeft = 0,
                        srcHeight = image.height,
                        srcWidth = image.width,
                        srcSize,
                        dstSize;

                    if (srcHeight < srcWidth) {
                        srcLeft = Math.ceil((srcWidth - srcHeight) / 2);
                        srcSize = srcHeight;
                    } else if (srcHeight > srcWidth) {
                        srcTop = Math.ceil((srcHeight - srcWidth) / 2);
                        srcSize = srcWidth;
                    }

                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');

                    template.$('img.logo').hide();
                    template.$('img.cover').hide();
                    template.$('.uploadBtn').hide();
                    template.$('.uploadMenu').hide();
                    template.$('#canvas').show();

                    dstSize = Math.min(template.$('#canvas').height(), template.$('#canvas').width()) * (window.devicePixelRatio || 1);
                    console.log(dstSize);
                    canvas.setAttribute('height', dstSize + 'px');
                    canvas.setAttribute('width', dstSize + 'px');

                    context.beginPath();
                    context.arc(dstSize/2, dstSize/2, dstSize/6, 0, 2 * Math.PI, false);
                    context.clip();

                    context.drawImage(image, srcLeft, srcTop, srcSize, srcSize, dstSize/3, dstSize/3, dstSize/3, dstSize/3);
                    console.log(srcLeft, srcTop, srcSize, srcSize, dstSize/3, dstSize/3, dstSize/3, dstSize/3);
                })
                .catch(TypeError, function(error){
                    console.error('TypeError', error);
                })
                .catch(function(error){
                    console.error(error);
                });
        },
        'change #uploadCoverFile': function (e, template) {
            template.$('.uploadMenu').toggle();
            template.data.cover = {};

            loadFile(e.currentTarget.files[0])
                .then(function(dataUrl){
                    return loadImage(dataUrl);
                })
                .then(function(image){
                    var srcTop = 0,
                        srcLeft = 0,
                        srcHeight = image.height,
                        srcWidth = image.width,
                        srcSize,
                        dstSize;

                    if (srcHeight < srcWidth) {
                        srcLeft = Math.ceil((srcWidth - srcHeight) / 2);
                        srcSize = srcHeight;
                    } else if (srcHeight > srcWidth) {
                        srcTop = Math.ceil((srcHeight - srcWidth) / 2);
                        srcSize = srcWidth;
                    }

                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');

                    template.$('img.logo').hide();
                    template.$('img.cover').hide();
                    template.$('.uploadBtn').hide();
                    template.$('.uploadMenu').hide();
                    template.$('canvas#canvas').show();

                    dstSize = Math.min(template.$('#canvas').height(), template.$('#canvas').width()) * window.devicePixelRatio;
                    canvas.setAttribute('height', dstSize + 'px');
                    canvas.setAttribute('width', dstSize + 'px');

                    context.drawImage(image, srcLeft, srcTop, srcSize, srcSize, 0, 0, dstSize, dstSize);
                })
                .catch(TypeError, function(error){
                    console.error('TypeError', error);
                })
                .catch(function(error){
                    console.error(error);
                });
        },
        'click .uploadBtn': function(e, template){
            template.$('.uploadMenu').toggle();
        }
    });
})();
