(function(){

    var initialColor = '#3DA3A7';

    var fadeToolbar = function(){
        var $images = $('.images'),
            top = $(window).scrollTop(),
            height = $images.height(),
            $mainToolbar = $('#mainToolbar');

        $mainToolbar.css({
            "background-color": one.color(initialColor).alpha(Math.min(Math.max(Math.floor(top/(height-48) * 20) / 20, 0), 1)).cssa()
        });
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
