Meteor.methods({
    createOrderFromCart: function (cartId) {
        var orders = {},
            userId = this.userId;

        CartItems.find({cartId: cartId}).forEach(function (cartItem) {
            var product = Products.findOne(cartItem.productId),
                shop = Shops.findOne(product.shopId);

            var order = orders[shop._id];

            if (!order) {
                order = orders[shop._id] = {
                    items: [],
                    subtotal: 0,
                    totalTax: 0,
                    totalShipping: 0,
                    total: 0,
                    shopId: shop._id
                };
                if (userId) {
                    order.userId = userId
                } else {
                    order.cartId = cartId
                }
            }

            var orderItem = {
                productId: cartItem.productId,
                itemCount:  cartItem.quantity
            };

            if (!product.price) {
                return;
            }

            orderItem.itemPrice = Number(product.price);
            orderItem.price = orderItem.itemPrice * orderItem.itemCount;

            order.items.push(orderItem);

            order.subtotal += orderItem.price;

            if (product.shipping && product.shipping.cost) {
                order.totalShipping += Number(product.shipping.cost) * orderItem.itemCount;
            }
        });

        _.each(orders, function(order, shopId){
            var shop = Shops.findOne(shopId);
            order.totalTax = Math.ceil((order.subtotal + order.totalShipping) * Number(shop.payments.tax)) / 100;
            order.total = order.totalTax + order.totalShipping + order.subtotal;
            Orders.insert(order);
        });

        CartItems.remove({cartId: cartId});

        return true;
    }
});