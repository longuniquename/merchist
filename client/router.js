(function () {

    var setOgMeta = function (data) {
        $('meta[property^="og:"], meta[property^="fb:"], meta[property^="product:"], meta[property^="al:"]', $('head')).remove();
        _.each(data, function (metaAttrs) {
            if (metaAttrs.property && metaAttrs.content) {
                var $meta = $('<meta/>');
                $meta.attr(metaAttrs);
                $meta.appendTo('head');
            }
        });
    };

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

    Router.route('/products/:_id', function () {
        var productId = this.params._id;

        this.layout('mainLayout', {
            data: {
                back: function () {
                    return Router.path('marketplace');
                }
            }
        });
        this.wait(Meteor.subscribe('product', productId));
        this.wait(Meteor.subscribe("productImages", productId));
        this.wait(Meteor.subscribe("serviceConfiguration", 'facebook'));

        if (this.ready()) {
            var product = Products.findOne(productId),
                images = Images.find({_id: {$in: product.imageIds}}),
                facebookConfig = ServiceConfiguration.configurations.findOne({service: 'facebook'}),
                ogData = [
                    {property: 'fb:app_id', content: facebookConfig.appId},
                    {property: 'og:site_name', content: 'Merchist'},
                    {property: 'og:type', content: 'product'},
                    {property: 'og:url', content: Router.url('products.view', product)},
                    {property: 'og:title', content: product.title},
                    {property: 'og:description', content: product.description},
                    {property: 'product:price:amount', content: product.price},
                    {property: 'product:price:currency', content: 'USD'},
                    {
                        property: 'al:android:url',
                        content:  'merchist://' + Router.path('products.view', product).replace(/^\/+/, '')
                    },
                    {property: 'al:android:package', content: 'com.merchist.client'},
                    {property: 'al:android:app_name', content: 'Merchist'}
                ];

            images.forEach(function (image, index) {
                var parser = document.createElement('a');
                parser.href = image.url({store: 'xl', auth: false, download: true});
                ogData.push({
                    property: 'og:image', content: 'http://' + parser.host + parser.pathname + parser.search
                });
            });

            setOgMeta(ogData);

            ga('send', {
                hitType:  'pageview',
                location: Router.url('products.view', {_id: productId}),
                page:     Router.path('products.view', {_id: productId}),
                title:    Products.findOne(productId).title
            });

            this.render('marketplaceProductsView', {
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
        name: 'products.view'
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
                this.render('splash');
            } else {
                this.next();
            }
        });
    }

})();
