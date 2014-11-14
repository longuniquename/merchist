(function(){

    Template.managementProductsEdit.helpers({
        shop: function(){
            Meteor.subscribe("shop", this.product().shopId);
            return Shops.findOne(this.product().shopId);
        }
    });

})();