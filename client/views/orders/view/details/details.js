(function(){

    Template.ordersViewDetails.helpers({
        'shop': function(){
            Meteor.subscribe('shop', this.shopId);
            return Shops.findOne(this.shopId);
        },
        'logo': function(){
            Meteor.subscribe("image", this.logoId);
            return Images.findOne(this.logoId);
        },
        'itemsCount': function(){
            var itemsCount = 0;
            _.each(this.items, function(orderItem){
                itemsCount += orderItem.itemCount;
            });
            return itemsCount;
        }
    });

    Template.ordersViewDetails.events({
        'click .payWithPayPalBtn': function(e, template){
            this.pay();
        }
    });

})();
