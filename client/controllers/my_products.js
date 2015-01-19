MyProductsController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'productsMyView',

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
