(function () {

    Template.cart.helpers({
        'cartItems': function () {
            var cartId = localStorage["cartId"];
            return CartItems.find({cartId: cartId});
        },
        'product':   function () {
            Meteor.subscribe("product", this.productId);
            return Products.findOne(this.productId);
        },
        'image':     function () {
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        },
        'total':     function () {
            var total = 0;
            var cartId = localStorage["cartId"];
            CartItems.find({cartId: cartId}).fetch().forEach(function (cartItem) {
                var product = Products.findOne(cartItem.productId);
                if (product) {
                    total += product.price * cartItem.quantity;
                }
            });
            return total;
        }
    });

    Template.cart.events({
        "click .overlay":           function (e, template) {
            template.$('#cart').removeClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'cart',
                'eventAction':   'close',
                'eventLabel':    'Cart closed'
            });
        },
        "click .closeBtn":          function (e, template) {
            template.$('#cart').removeClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'cart',
                'eventAction':   'close',
                'eventLabel':    'Cart closed'
            });
        },
        'change [name="quantity"]': function (e, template) {
            var quantity = parseInt($(e.currentTarget).val());

            check(quantity, Match.Integer);

            CartItems.update(this._id, {$set: {quantity: quantity}});
        },
        'click .removeBtn':         function (e, template) {
            CartItems.remove(this._id);

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'button',
                'eventAction':   'click',
                'eventLabel':    'Remove button'
            });
        },
        'click .purchaseBtn':       function (e, template) {
            var cartId = localStorage["cartId"];
            var $btn = $(e.currentTarget).button('generating').prop('disabled', true);

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'button',
                'eventAction':   'click',
                'eventLabel':    'Purchase button'
            });

            Meteor.call('createOrderFromCart', cartId, function(err, order){
                Router.go('orders');
                $btn.button('reset').prop('disabled', false);

                template.$('#cart').removeClass('visible');
                ga('send', {
                    'hitType':       'event',
                    'eventCategory': 'cart',
                    'eventAction':   'close',
                    'eventLabel':    'Cart closed'
                });
            });
        }
    });

})();
