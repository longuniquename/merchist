Router.route('/', function () {
    this.redirect('/marketplace');
}, {
    name: 'root'
});

Router.route('/marketplace', function () {
    this.layout('rootLayout');
    this.render('marketplace');
}, {
    name: 'marketplace'
});

Router.route('/management/shops/:_id', function () {
    var shopId = this.params._id;

    this.layout('rootLayout');
    this.wait(Meteor.subscribe('shop', shopId));

    if (this.ready()) {
        this.render('managementShopEdit', {
            data: {
                shop: function () {
                    console.log(Shops.findOne({_id: shopId}));
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

    this.layout('rootLayout');
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