(function(){

    Template.productEditView.helpers({
        shop: function(){
            if (this.product()) {
                Meteor.subscribe("shop", this.product().shopId);
                return Shops.findOne(this.product().shopId);
            } else {
                return null;
            }
        }
    });

})();