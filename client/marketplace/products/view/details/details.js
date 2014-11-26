(function () {

    Template.marketplaceProductsViewDetails.events({
        'click .buyBtn': function (e, template) {
            var cartId = localStorage["cartId"];

            var cartItem = CartItems.findOne({cartId: cartId, productId: this._id});

            if (!cartItem) {
                CartItems.insert({cartId: cartId, productId: this._id, quantity: 1});
            }

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'button',
                'eventAction':   'click',
                'eventLabel':    'Buy button'
            });
        }
    });

})(Template);