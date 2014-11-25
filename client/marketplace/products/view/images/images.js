(function(){

    Template.marketplaceProductsViewImages.rendered = function () {
        var $mainToolbar = $('#mainToolbar');

        var initialColor = $mainToolbar.css("background-color");


        var resizeImagesBlock = function () {
            var imagesBlock = this.$('.images');
            imagesBlock.css({
                height: imagesBlock.width()
            });
        };

        var fadeToolbar = function(){
            var imagesBlock = this.$('.images'),
                top = $(window).scrollTop(),
                height = imagesBlock.height();
            $mainToolbar.css("background-color", one.color(initialColor).alpha(top/height).cssa());
        };

        $(window).bind('resize', function () {
            resizeImagesBlock();
        });

        $(window).bind('scroll', function () {
            fadeToolbar();
        });

        resizeImagesBlock();
        fadeToolbar();
    };

    Template.marketplaceProductsViewImages.helpers({
        'image': function(){
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

})(Template);
