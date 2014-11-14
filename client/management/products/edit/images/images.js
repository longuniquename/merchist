(function(){

    Template.managementProductsEditImages.rendered = function () {
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

    Template.managementProductsEditImages.helpers({

    });

    Template.managementProductsEditImages.events({

    });

})(Template);