OrdersController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'ordersList',

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
