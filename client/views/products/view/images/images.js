(function () {

    Template.productViewImagesBlock.rendered = function () {
        this.$('#product-images-carousel .carousel-inner .item:first-child').addClass('active');
        this.$('#product-images-carousel').carousel();
    };

})(Template);
