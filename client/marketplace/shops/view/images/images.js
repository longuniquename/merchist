(function(){

    Template.marketplaceShopsViewImages.rendered = function () {
        var resizeImagesBlock = function () {
            var imagesBlock = this.$('.images');
            imagesBlock.css({
                height: imagesBlock.width()
            });
        };

        $(window).bind('resize', function () {
            resizeImagesBlock();
        });

        resizeImagesBlock();
    };

    Template.marketplaceShopsViewImages.helpers({
        'cover': function(){
            Meteor.subscribe("image", this.coverId);
            return Images.findOne(this.coverId);
        }
    });

})(Template);