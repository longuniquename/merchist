MyProductsController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'myProductsView',

    waitOn: function () {
        return Meteor.subscribe('products.my');
    },

    data: {
        products: function () {
            return Products.find({userId: Meteor.userId()});
        }
    },

    action: function () {
        this.render();
    }
});
