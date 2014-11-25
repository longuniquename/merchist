(function(){

    Template.ordersViewItems.helpers({
        'currency': function(price){
            return '$' + Number(price).toFixed(2);
        },
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