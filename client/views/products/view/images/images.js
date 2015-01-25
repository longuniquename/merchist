(function () {

    var fadeToolbar = function () {
        var $images = $('.images-block'),
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
        var $images = $('.images-block');

        $images.css({
            height: $images.width()
        });
    };

    Template.productViewImagesBlock.rendered = function () {
        $(window).bind('resize', resizeImagesBlock);
        $(window).bind('scroll', fadeToolbar);
        resizeImagesBlock();
        fadeToolbar();
    };

    Template.productViewImagesBlock.destroyed = function () {
        $('#mainToolbar').removeClass('transparent');

        $(window).unbind('resize', resizeImagesBlock);
        $(window).unbind('scroll', fadeToolbar);
    };

    Template.productViewImagesBlock.helpers({
        images: function () {
            return Images.find({_id: {$in: this.imageIds}});
        }
    });

})(Template);
