Router.route('/products/:_id/edit', {
    name:       'products.edit',
    controller: 'ProductEditController'
});

ProductEditController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'productEditView',

    waitOn: function () {
        return Meteor.subscribe('product', this.params._id);
    },

    data: function () {
        var self = this;
        return {
            product: function () {
                return Products.findOne(self.params._id);
            }
        }
    },

    action: function () {
        this.render();
    }
});
