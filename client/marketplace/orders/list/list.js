(function(){

    Template.ordersList.helpers({
        'shop': function(){
            Meteor.subscribe('shop', this.shopId);
            return Shops.findOne(this.shopId);
        }
    });

})();