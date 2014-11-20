(function(){

    Template.marketplaceProductsViewOther.helpers({
        'shop': function(){
            Meteor.subscribe("shop", this.shopId);
            return Shops.findOne(this.shopId);
        },
        'logo': function(){
            Meteor.subscribe("image", this.logoId);
            return Images.findOne(this.logoId);
        },
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