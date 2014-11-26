(function(){

    var initialColor = '#3DA3A7';

    var fadeToolbar = function(){
        var $images = $('.images'),
            top = $(window).scrollTop(),
            height = $images.height(),
            $mainToolbar = $('#mainToolbar');

        $mainToolbar.css({
            "background-color": one.color(initialColor).alpha(top/(height-48)).cssa()
        });

        $('img', $images).css('top', Math.floor(top/2));
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
        var $mainToolbar = $('#mainToolbar');

        $(window).unbind('resize', resizeImagesBlock);
        $(window).unbind('scroll', fadeToolbar);

        $mainToolbar.css({
            "background-color": initialColor
        });
    };

    Template.marketplaceShopsViewImages.helpers({
        'cover': function(){
            Meteor.subscribe("image", this.coverId);
            return Images.findOne(this.coverId);
        }
    });

})(Template);