(function(){

    var initialColor = '#3DA3A7';

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

    Template.marketplaceShopsViewImages.rendered = function () {
        $(window).bind('resize', resizeImagesBlock);
        $(window).bind('scroll', fadeToolbar);
        resizeImagesBlock();
        fadeToolbar();
    };

    Template.marketplaceShopsViewImages.destroyed = function(){
        $('#mainToolbar').removeClass('transparent');

        $(window).unbind('resize', resizeImagesBlock);
        $(window).unbind('scroll', fadeToolbar);
    };

    Template.marketplaceShopsViewImages.helpers({
        'cover': function(){
            Meteor.subscribe("image", this.coverId);
            return Images.findOne(this.coverId);
        }
    });

})(Template);