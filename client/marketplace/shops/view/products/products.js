(function(){

    Template.marketplaceShopsViewProducts.helpers({
        'products': function(){
            Meteor.subscribe("products");
            return Products.find({shopId: this._id});
        },
        'image': function(){
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

})(Template);