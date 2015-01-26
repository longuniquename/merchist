Router.route('/orders', {
    name:       'orders',
    controller: 'OrdersController'
});

OrdersController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'ordersListView',

    waitOn: function () {
        return Meteor.subscribe('orders');
    },

    data: {
        orders: function () {
            return Orders.find();
        }
    },

    action: function () {
        this.render();
    }
});
