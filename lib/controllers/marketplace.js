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

    action: function () {
        this.render();
    }
});
