Router.route('/products/my', {
    name:       'products.my',
    controller: 'MyProductsController'
});

MyProductsController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'productsMyView',

    waitOn: function () {
        return Meteor.subscribe('products.my');
    },

    data: {
        products: function () {
            return Products.find({userId: Meteor.userId()}, {sort: {createdAt: -1}});
        }
    },

    action: function () {
        if (Meteor.userId()) {
            this.render();
        } else {
            this.render('authView');
        }
    }
});
