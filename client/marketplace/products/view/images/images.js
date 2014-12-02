(function () {

    var metaKey;

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

        metaKey = Blaze.Meta.registerMeta({
            'og:image': Meteor.absoluteUrl(this.data.url().replace(/^\/+/, ''))
        });
    };

    Template.marketplaceProductsViewImages.destroyed = function () {
        $('#mainToolbar').removeClass('transparent');

        $(window).unbind('resize', resizeImagesBlock);
        $(window).unbind('scroll', fadeToolbar);

        Blaze.Meta.unregisterMeta(metaKey);
    };

    Template.marketplaceProductsViewImages.helpers({
        'image': function () {
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

})(Template);
