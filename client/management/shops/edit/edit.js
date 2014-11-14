(function () {

    function loadFile(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            reader.onerror = function (e) {
                reject();
            };
            reader.readAsDataURL(file);
        });
    }

    function loadImage(src) {
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.onload = function () {
                resolve(image);
            };
            image.src = src;
        });
    }

    Template.managementShopEdit.rendered = function () {
        var resizeImagesBlock = function () {
            var imagesBlock = this.$('.imagesBlock');
            imagesBlock.css({
                height: imagesBlock.width()
            });
        };

        $(window).bind('resize', function () {
            resizeImagesBlock();
        });

        resizeImagesBlock();
    };
    Template.shopEditImagesView.helpers({
        logo: function () {
            if (this.logoId) {
                Meteor.subscribe("image", this.logoId);
                return Images.findOne(this.logoId);
            } else {
                return false;
            }
        },
        cover: function () {
            if (this.coverId) {
                Meteor.subscribe("image", this.coverId);
                return Images.findOne(this.coverId);
            } else {
                return false;
            }
        }
    });

    Template.managementShopEdit.events({
        'submit .shopEditForm': function (e) {
            e.preventDefault();

            var data = {
                title: $('input[name="title"]', e.currentTarget).val(),
                subtitle: $('input[name="subtitle"]', e.currentTarget).val(),
                description: $('[name="description"]', e.currentTarget).val(),
                tax: $('[name="tax"]', e.currentTarget).val()
            };

            if (!this._id) {
                Router.go('shops.edit', {_id: Shops.insert(data)});
            } else {
                Shops.update(this._id, {$set: data});
            }
        },
        'change #uploadLogoFile': function (e, template) {
            template.$('.imagesBlock').addClass('editing');
            template.$('.uploadMenu').hide();
            template.data.logo = {};
            template.data.editedImage = 'logo';

            loadFile(e.currentTarget.files[0])
                .then(function (dataUrl) {
                    template.data.logo = {
                        file: dataUrl
                    };
                    return loadImage(dataUrl);
                })
                .then(function (image) {
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

                    template.data.logo.size = srcSize;
                    template.data.logo.top = srcTop;
                    template.data.logo.left = srcLeft;

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

                    tx.arc(dstSize / 2, dstSize / 2, dstSize / 6 - (window.devicePixelRatio || 1), 0, 2 * Math.PI, false);
                    tx.closePath();
                    tx.fill();

                    ctx.drawImage(image, srcLeft, srcTop, srcSize, srcSize, dstSize / 3, dstSize / 3, dstSize / 3, dstSize / 3);
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-in';
                    ctx.drawImage(temp, 0, 0);
                    ctx.restore();
                })
                .catch(TypeError, function (error) {
                    console.error('TypeError', error);
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        'change #uploadCoverFile': function (e, template) {
            template.$('.imagesBlock').addClass('editing');
            template.$('.uploadMenu').hide();
            template.data.cover = {};
            template.data.editedImage = 'cover';

            loadFile(e.currentTarget.files[0])
                .then(function (dataUrl) {
                    template.data.cover = {
                        file: dataUrl
                    };
                    return loadImage(dataUrl);
                })
                .then(function (image) {
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

                    template.data.cover.size = srcSize;
                    template.data.cover.top = srcTop;
                    template.data.cover.left = srcLeft;

                    var canvas = document.getElementById('canvas');
                    var ctx = canvas.getContext('2d');

                    dstSize = Math.min(template.$('#canvas').height(), template.$('#canvas').width()) * window.devicePixelRatio;
                    canvas.setAttribute('height', dstSize + 'px');
                    canvas.setAttribute('width', dstSize + 'px');

                    ctx.drawImage(image, srcLeft, srcTop, srcSize, srcSize, 0, 0, dstSize, dstSize);
                })
                .catch(TypeError, function (error) {
                    console.error('TypeError', error);
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        'click .uploadBtn': function (e, template) {
            template.$('.uploadMenu').toggle();
        },
        'click .cancelBtn': function (e, template) {
            e.preventDefault();
            template.$('.imagesBlock').removeClass('editing');
        },
        'click .saveBtn': function (e, template) {
            e.preventDefault();
            switch (template.data.editedImage) {
                case 'logo':
                    loadImage(template.data.logo.file)
                        .then(function (image) {

                            var offsetTop = template.data.logo.top,
                                offsetLeft = template.data.logo.left,
                                size = template.data.logo.size;

                            var canvas = document.createElement('canvas'),
                                ctx = canvas.getContext('2d'),
                                temp = document.createElement('canvas'),
                                tx = temp.getContext('2d');

                            temp.width = canvas.width = size;
                            temp.height = canvas.height = size;

                            tx.translate(-temp.width, 0);
                            tx.shadowOffsetX = temp.width;
                            tx.shadowOffsetY = 0;
                            tx.shadowColor = '#000';
                            tx.shadowBlur = 1;

                            tx.arc(size / 2, size / 2, size / 2 - 1, 0, 2 * Math.PI, false);
                            tx.closePath();
                            tx.fill();

                            ctx.drawImage(image, offsetLeft, offsetTop, size, size, 0, 0, size, size);
                            ctx.save();
                            ctx.globalCompositeOperation = 'destination-in';
                            ctx.drawImage(temp, 0, 0);
                            ctx.restore();

                            //template.$('.logo').attr('src', canvas.toDataURL());
                            template.$('.imagesBlock').removeClass('editing');

                            Images.insert(canvas.toDataURL(), function (err, fileObj) {
                                if (template.data.shop()._id) {
                                    Shops.update(template.data.shop()._id, {$set: {logoId: fileObj._id}});
                                } else {
                                    Router.go('shops.edit', {_id: Shops.insert({logoId: fileObj._id})});
                                }
                            });
                        });

                    break;
                case 'cover':
                    loadImage(template.data.cover.file)
                        .then(function (image) {

                            var offsetTop = template.data.cover.top,
                                offsetLeft = template.data.cover.left,
                                size = template.data.cover.size;

                            var canvas = document.createElement('canvas'),
                                ctx = canvas.getContext('2d');

                            canvas.width = size;
                            canvas.height = size;

                            ctx.drawImage(image, offsetLeft, offsetTop, size, size, 0, 0, size, size);
                            template.$('.imagesBlock').removeClass('editing');

                            Images.insert(canvas.toDataURL(), function (err, fileObj) {
                                if (template.data.shop()._id) {
                                    Shops.update(template.data.shop()._id, {$set: {coverId: fileObj._id}});
                                } else {
                                    Router.go('shops.edit', {_id: Shops.insert({coverId: fileObj._id})});
                                }
                            });
                        });
                    break;
            }
        },
        'click .menuBtn': function(e){
            e.preventDefault();
            $('nav#menu').show();
        }
    });
})();
