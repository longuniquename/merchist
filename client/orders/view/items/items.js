(function(){

    Template.ordersViewItems.helpers({
        'product': function(){
            Meteor.subscribe('product', this.productId);
            return Products.findOne(this.productId);
        },
        'image': function(){
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

})();