Router.route('/', function () {
    this.redirect('/marketplace');
}, {
    name: 'root'
});

Router.route('/terms', function () {
    this.layout('mainLayout');
    this.render('terms');
}, {
    name: 'terms'
});

Router.route('/policy', function () {
    this.layout('mainLayout');
    this.render('policy');
}, {
    name: 'policy'
});

Router.route('/profile', function () {
    this.layout('mainLayout');
    this.render('profile');
}, {
    name: 'profile'
});

Router.route('/marketplace', function () {
    this.layout('mainLayout');
    this.wait(Meteor.subscribe('products'));

    if (this.ready()) {
        this.render('marketplace', {
            data: {
                products: function () {
                    return Products.find({isPublic: true}, {sort: {title: 1}, limit: 20});
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'marketplace'
});

Router.route('/marketplace/products/:_id', function () {
    var productId = this.params._id;

    this.layout('internalLayout');
    this.wait(Meteor.subscribe('product', productId));

    if (this.ready()) {
        this.render('marketplaceProductsView', {
            data: {
                product: function () {
                    return Products.findOne({_id: productId});
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'products.view'
});

Router.route('/marketplace/shops/:_id', function () {
    var shopId = this.params._id;

    this.layout('internalLayout');
    this.wait(Meteor.subscribe('shop', shopId));

    if (this.ready()) {
        this.render('marketplaceShopsView', {
            data: {
                shop: function () {
                    return Shops.findOne({_id: shopId});
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'shops.view'
});

Router.route('/orders', function () {
    this.layout('mainLayout');
    var cartId = localStorage["cartId"];

    this.wait(Meteor.subscribe('myOrders', cartId));

    if (this.ready()) {
        this.render('ordersList', {
            data: {
                orders: function () {
                    if (Meteor.userId()) {
                        return Orders.find({userId: Meteor.userId()});
                    } else {
                        var cartId = localStorage["cartId"];
                        return Orders.find({cartId: cartId});
                    }
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'orders'
});

Router.route('/orders/:_id', function () {
    var orderId = this.params._id;
    this.layout('internalLayout');

    this.wait(Meteor.subscribe('order', orderId));

    if (this.ready()) {
        this.render('ordersView', {
            data: {
                order: function () {
                    return Orders.findOne({_id: orderId});
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'orders.view'
});


Router.route('/management/shops/:_id', function () {
    var shopId = this.params._id;

    this.layout('rootLayout');
    this.wait(Meteor.subscribe('shop', shopId));

    if (this.ready()) {
        this.render('managementShopEdit', {
            data: {
                shop: function () {
                    return Shops.findOne({_id: shopId});
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'shops.edit'
});

Router.route('/management/products/:_id', function () {
    var productId = this.params._id;

    this.layout('internalLayout');
    this.wait(Meteor.subscribe('product', productId));

    if (this.ready()) {
        this.render('managementProductsEdit', {
            data: {
                product: function () {
                    return Products.findOne({_id: productId});
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'products.edit'
});

Router.route('/paypal/return', function () {
    this.render('loading');

    Meteor.call('PayPal:verifyAccountRequest', this.params.query, function(err, shopId){
        Router.go('shops.edit', {_id: shopId});
    });
}, {
    name: 'paypal.return'
});
