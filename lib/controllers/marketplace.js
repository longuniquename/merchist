Router.route('/', function () {
    this.redirect('/marketplace');
}, {
    name: 'root'
});

Router.route('/marketplace', {
    name:       'marketplace',
    controller: 'MarketplaceController'
});

MarketplaceController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'marketplaceView',

    increment: 12,

    productsLimit: function () {
        return parseInt(this.params.query.limit) || this.increment;
    },

    findOptions: function () {
        return {sort: {createdAt: -1}, limit: this.productsLimit()};
    },

    subscriptions: function () {
        this.productsSub = Meteor.subscribe('products', this.findOptions());
    },

    products: function () {
        return Products.find({}, this.findOptions());
    },

    data: function () {
        var hasMore = this.products().count() === this.productsLimit();
        var nextPath = this.route.path({}, {query: {limit: this.productsLimit() + this.increment}});
        return {
            products: this.products(),
            ready:    this.productsSub.ready,
            nextPath: hasMore ? nextPath : null
        }
    },

    action: function () {
        this.render();
    }
});
