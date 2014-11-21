(function () {

    Template.internalLayout.helpers({
        'showCart':  function () {
            var cartId = localStorage["cartId"];
            return !!CartItems.find({cartId: cartId}).fetch().length;
        },
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

    Template.internalLayout.events({
        'change [name="quantity"]': function (e, template) {
            var quantity = parseInt($(e.currentTarget).val());

            check(quantity, Match.Integer);

            CartItems.update(this._id, {$set: {quantity: quantity}});
        },
        'click .removeBtn':         function (e, template) {
            CartItems.remove(this._id);
        },
        'click .cartBtn':           function (e, template) {
            template.$('.cart').toggle();
        },
        'click .purchaseBtn':       function (e, template) {
            var cartId = localStorage["cartId"];
            var $btn = $(e.currentTarget).button('generating').prop('disabled', true);

            Meteor.call('createOrderFromCart', cartId, function(err, order){
                console.log(order);
                $btn.button('reset').prop('disabled', false);
            });

        }
    });

})();