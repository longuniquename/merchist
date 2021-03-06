(function () {

    var fadeToolbar = function () {
        var $images = $('.images'),
            top = $(window).scrollTop(),
            height = $images.height(),
            $mainToolbar = $('#mainToolbar');

        if (top < height - 48) {
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

    Template.marketplaceProductsViewImages.destroyed = function () {
        $('#mainToolbar').removeClass('transparent');

        $(window).unbind('resize', resizeImagesBlock);
        $(window).unbind('scroll', fadeToolbar);

        Blaze.Meta.unregisterMeta(metaKey);
    };

    Template.marketplaceProductsViewImages.helpers({
        images: function () {
            return Images.find({_id: {$in: this.imageIds}});
        }
    });

})(Template);
