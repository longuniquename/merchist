(function () {

    Template.marketplaceProductsView.helpers({
        'image': function () {
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

})();
