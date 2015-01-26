Router.route('/sell', {
    name:       'sell',
    controller: 'SellController'
});

SellController = RouteController.extend({
    layoutTemplate: 'mainLayout',
    template:       'sellView',

    action: function () {
        if (Meteor.userId()) {
            if (
                !Meteor.user().services || !Meteor.user().services.paypal ||
                Meteor.user().services.paypal.accountType !== 'BUSINESS'
            ) {
                this.render('authPayPalView');
            } else {
                this.render();
            }
        } else if (Meteor.loggingIn()) {
            this.render('loadingView');
        } else {
            this.render('authView');
        }
    }
});
