(function () {

    Router.route('/', function () {
        this.redirect('/marketplace');
    }, {
        name: 'root'
    });

    Router.route('/splash', function () {
        if (Meteor.isCordova) {
            this.render('splash');
        } else {
            this.redirect('/marketplace');
        }
    }, {
        name: 'splash'
    });

    Router.route('/terms', function () {
        this.layout('mainLayout');
        this.render('terms');

        ga('send', {
            hitType:  'pageview',
            location: Router.url('terms'),
            page:     Router.path('terms'),
            title:    'Terms of service'
        });
    }, {
        name: 'terms'
    });

    Router.route('/policy', function () {
        this.layout('mainLayout');
        this.render('policy');

        ga('send', {
            hitType:  'pageview',
            location: Router.url('policy'),
            page:     Router.path('policy'),
            title:    'Privacy policy'
        });
    }, {
        name: 'policy'
    });

    Router.route('/profile', function () {
        this.layout('mainLayout');
        this.wait(Meteor.subscribe('userData'));

        ga('send', {
            hitType:  'pageview',
            location: Router.url('profile'),
            page:     Router.path('profile'),
            title:    'Profile'
        });

        if (this.ready()) {
            this.render('profile');
        } else {
            this.render('loading');
        }
    }, {
        name: 'profile'
    });

    Router.route('/marketplace', function () {
        this.layout('mainLayout');
        this.wait(Meteor.subscribe('products'));

        ga('send', {
            hitType:  'pageview',
            location: Router.url('marketplace'),
            page:     Router.path('marketplace'),
            title:    'Marketplace'
        });

        if (this.ready()) {
            this.render('marketplace', {
                data: {
                    products: function () {
                        return Products.find({isPublic: true}, {sort: {title: 1}, limit: 100});
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

        this.layout('mainLayout', {
            data: {
                back:  function () {
                    return Router.path('marketplace');
                }
            }
        });
        this.wait(Meteor.subscribe('product', productId));
        this.wait(Meteor.subscribe("productImages", productId));

        if (this.ready()) {

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
            this.render('loading');
        }
    }, {
        name: 'products.view'
    });

    Router.route('/marketplace/shops/:_id', function () {
        var shopId = this.params._id;

        this.layout('mainLayout', {
            data: {
                back:  function () {
                    return Router.path('marketplace');
                }
            }
        });
        this.wait(Meteor.subscribe('shop', shopId));

        if (this.ready()) {

            ga('send', {
                hitType:  'pageview',
                location: Router.url('shops.view', {_id: shopId}),
                page:     Router.path('shops.view', {_id: shopId}),
                title:    Shops.findOne(shopId).title
            });

            this.render('marketplaceShopsView', {
                data: {
                    shop: function () {
                        return Shops.findOne(shopId);
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

        ga('send', {
            hitType:  'pageview',
            location: Router.url('orders'),
            page:     Router.path('orders'),
            title:    'Orders'
        });

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

        this.layout('mainLayout', {
            data: {
                back:  function () {
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

            this.render('ordersView', {
                data: {
                    order: function () {
                        return Orders.findOne(orderId);
                    }
                }
            });
        } else {
            this.render('loading');
        }
    }, {
        name: 'orders.view'
    });

    Router.route('/sell', function () {
        this.layout('mainLayout', {
            data: {
                back:  function () {
                    return Router.path('marketplace');
                }
            }
        });
        this.render('sellView');
    }, {
        name: 'sell'
    });

    Router.route('/management/shops/:_id', function () {
        var shopId = this.params._id;

        this.layout('mainLayout');
        this.wait(Meteor.subscribe('shop', shopId));

        if (this.ready()) {

            ga('send', {
                hitType:  'pageview',
                location: Router.url('shops.edit', {_id: shopId}),
                page:     Router.path('shops.edit', {_id: shopId}),
                title:    Shops.findOne(shopId).title
            });

            this.render('managementShopEdit', {
                data: {
                    shop: function () {
                        return Shops.findOne(shopId);
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

            this.render('managementProductsEdit', {
                data: {
                    product: function () {
                        return Products.findOne(productId);
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

        Meteor.call('PayPal:verifyAccountRequest', this.params.query, function (err, shopId) {
            Router.go('shops.edit', {_id: shopId});
        });
    }, {
        name: 'paypal.return'
    });

    Router.route('/admin/users', function () {
        this.layout('mainLayout');
        this.wait(Meteor.subscribe('allUsersData'));

        if (this.ready()) {
            console.log(Meteor.users.find({}, {sort: {createdAt: -1}}).fetch());

            this.render('adminUsers', {
                data: {
                    users: function () {
                        return Meteor.users.find({}, {sort: {createdAt: -1}});
                    }
                }
            });
        } else {
            this.render('loading');
        }
    }, {
        name: 'admin.users'
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
