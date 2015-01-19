(function () {

    Router.route('/', function () {
        this.redirect('/marketplace');
    }, {
        name: 'root'
    });

    Router.route('/splash', {
        name:       'splash',
        controller: 'SplashController'
    });

    Router.route('/marketplace', {
        name:       'marketplace',
        controller: 'MarketplaceController'
    });

    Router.route('/products/my', {
        name:       'products.my',
        controller: 'MyProductsController'
    });

    Router.route('/terms', {
        name:       'terms',
        controller: 'TermsController'
    });

    Router.route('/policy', {
        name:       'policy',
        controller: 'PolicyController'
    });

    Router.route('/profile', {
        name:       'profile',
        controller: 'ProfileController'
    });

    Router.route('/products/:_id', {
        name:       'products.view',
        controller: 'ProductViewController'
    });

    Router.route('/orders', {
        name:       'orders',
        controller: 'OrdersController'
    });

    Router.route('/orders/:_id', function () {
        var orderId = this.params._id;

        this.layout('mainLayout', {
            data: {
                back: function () {
                    return Router.path('orders');
                }
            }
        });

        this.wait(Meteor.subscribe('order', orderId));

        if (this.ready()) {

            ga('send', {
                hitType:  'pageview',
                location: Router.url('orders.view', {_id: orderId}),
                page:     Router.path('orders.view', {_id: orderId}),
                title:    Orders.findOne(orderId)._id
            });

            this.render('orderView', {
                data: {
                    order: function () {
                        return Orders.findOne(orderId);
                    }
                }
            });
        } else {
            this.render('loadingView');
        }
    }, {
        name: 'orders.view'
    });

    Router.route('/sell', {
        name:       'sell',
        controller: 'SellController'
    });

    Router.route('/management/products/:_id', function () {
        var productId = this.params._id;
        this.wait(Meteor.subscribe('product', productId));
        this.layout('mainLayout');

        if (this.ready()) {

            this.layout('mainLayout', {
                data: {
                    back: function () {
                        return Router.path('shops.edit', {_id: Products.findOne(productId).shopId});
                    }
                }
            });

            ga('send', {
                hitType:  'pageview',
                location: Router.url('products.edit', {_id: productId}),
                page:     Router.path('products.edit', {_id: productId}),
                title:    Products.findOne(productId).title
            });

            this.render('productEditView', {
                data: {
                    product: function () {
                        return Products.findOne(productId);
                    }
                }
            });
        } else {
            this.render('loadingView');
        }
    }, {
        name: 'products.edit'
    });

    if (Meteor.isCordova) {
        Router.onBeforeAction(function () {
            if (!Meteor.userId()) {
                this.render('splashView');
            } else {
                this.next();
            }
        });
    }

})();
