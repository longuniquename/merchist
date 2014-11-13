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

                    template.$('.imagesBlock').addClass('editing');

                    var canvas = document.getElementById('canvas'),
                        ctx = canvas.getContext('2d'),
                        temp = document.createElement('canvas'),
                        tx = temp.getContext('2d');

                    dstSize = Math.min(template.$('#canvas').height(), template.$('#canvas').width()) * (window.devicePixelRatio || 1);
                    canvas.setAttribute('height', dstSize + 'px');
                    canvas.setAttribute('width', dstSize + 'px');

                    temp.width = ctx.canvas.width;
                    temp.height = ctx.canvas.height;

                    tx.translate(-temp.width, 0);
                    tx.shadowOffsetX = temp.width;
                    tx.shadowOffsetY = 0;
                    tx.shadowColor = '#000';
                    tx.shadowBlur = (window.devicePixelRatio || 1);

                    tx.arc(dstSize/2, dstSize/2, dstSize/6 - (window.devicePixelRatio || 1), 0, 2 * Math.PI, false);
                    tx.closePath();
                    tx.fill();

                    ctx.drawImage(image, srcLeft, srcTop, srcSize, srcSize, dstSize/3, dstSize/3, dstSize/3, dstSize/3);
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-in';
                    ctx.drawImage(temp, 0, 0);
                    ctx.restore();
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
                    var ctx = canvas.getContext('2d');

                    template.$('.imagesBlock').addClass('editing');

                    dstSize = Math.min(template.$('#canvas').height(), template.$('#canvas').width()) * window.devicePixelRatio;
                    canvas.setAttribute('height', dstSize + 'px');
                    canvas.setAttribute('width', dstSize + 'px');

                    ctx.drawImage(image, srcLeft, srcTop, srcSize, srcSize, 0, 0, dstSize, dstSize);
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
