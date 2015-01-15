MyProductsController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loading',
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
