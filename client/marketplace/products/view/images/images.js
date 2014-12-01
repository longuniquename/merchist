(function(){

    var initialColor = '#3DA3A7';

    var fadeToolbar = function(){
        var $images = $('.images'),
            top = $(window).scrollTop(),
            height = $images.height(),
            $mainToolbar = $('#mainToolbar');

        if (top < height-48) {
            $mainToolbar.addClass('transparent');
        } else {
            $mainToolbar.removeClass('transparent');
        }
    };

    var resizeImagesBlock = function () {
        var $images = $('.images');

        $images.css({
            height: $images.width()
        });
    };

    Template.marketplaceProductsViewImages.rendered = function () {
        $(window).bind('resize', resizeImagesBlock);
        $(window).bind('scroll', fadeToolbar);
        resizeImagesBlock();
        fadeToolbar();
    };

    Template.marketplaceProductsViewImages.destroyed = function(){
        var $mainToolbar = $('#mainToolbar');

        $(window).unbind('resize', resizeImagesBlock);
        $(window).unbind('scroll', fadeToolbar);

        $mainToolbar.css({
            "background-color": initialColor
        });
    };

    Template.marketplaceProductsViewImages.helpers({
        'image': function(){
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

})(Template);
