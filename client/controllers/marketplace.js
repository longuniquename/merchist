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

    waitOn: function () {
        return Meteor.subscribe('products');
    },

    data: {
        products: function () {
            return Products.find({isPublic: true}, {sort: {title: 1}, limit: 100});
        }
    },

    action: function () {
        this.render();
    }
});
