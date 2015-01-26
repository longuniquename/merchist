Router.route('/orders/:_id', {
    name:       'orders.view',
    controller: 'OrderViewController'
});

OrderViewController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'orderView',

    waitOn: function () {
        return Meteor.subscribe('order', this.params._id);
    },

    data: function () {
        var self = this;
        return {
            order: function () {
                return Orders.findOne(self.params._id);
            }
        }
    },

    action: function () {
        this.render();
    }

});
