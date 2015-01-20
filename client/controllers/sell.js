Router.route('/sell', {
    name:       'sell',
    controller: 'SellController'
});

SellController = RouteController.extend({
    layoutTemplate: 'mainLayout',
    template:       'sellView'
});
