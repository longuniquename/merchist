Router.route('/', function () {
    this.redirect('/marketplace');
}, {
    name: 'root'
});

Router.route('/profile', function () {
    this.layout('rootLayout');
    this.render('profile');
}, {
    name: 'profile'
});

Router.route('/marketplace', function () {
    this.layout('rootLayout');
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
