Router.route('/sell', {
    name:       'sell',
    controller: 'SellController'
});

SellController = RouteController.extend({
    layoutTemplate: 'mainLayout',
    template:       'sellView',

    action: function () {
        if (Meteor.userId()) {
            this.render();
        } else {
            this.render('authView');
        }
    }
});
