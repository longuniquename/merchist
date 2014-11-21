(function(){

    Template.ordersViewDetails.helpers({
        'currency': function(price){
            return '$' + Number(price).toFixed(2);
        },
        'shop': function(){
            Meteor.subscribe('shop', this.shopId);
            return Shops.findOne(this.shopId);
        },
        'logo': function(){
            Meteor.subscribe("image", this.logoId);
            return Images.findOne(this.logoId);
        },
        'itemsCount': function(){
            return this.items.length;
        }
    });

})();