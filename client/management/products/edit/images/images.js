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
        'image': function(){
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

    Template.managementProductsEditImages.events({
        'change #uploadLogoFile': function(e, template){
            e.preventDefault();

            var reader = new FileReader();
            reader.onload = function (e) {
                Images.insert(e.target.result, function (err, fileObj) {
                    Products.update(template.data._id, {$set: {imageId: fileObj._id}});
                });
            };
            reader.readAsDataURL(e.currentTarget.files[0]);
        }
    });

})(Template);