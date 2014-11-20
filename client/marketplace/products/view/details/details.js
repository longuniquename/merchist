(function(){

    Template.marketplaceProductsViewDetails.helpers({
        'currency': function(price){
            return '$' + Number(price).toFixed(2);
        }
    });

    Template.marketplaceProductsViewDetails.events({
        'click .buyBtn': function(e, template){
            var cartId = localStorage["cartId"];

            var cartItem = CartItems.findOne({cartId: cartId, productId: this._id});

            if (!cartItem) {
                CartItems.insert({cartId: cartId, productId: this._id, quantity: 1});
            }
        }
    });

})(Template);