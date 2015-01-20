Router.route('/splash', {
    name:       'splash',
    controller: 'SplashController'
});

SplashController = RouteController.extend({
    template: 'splashView',

    action: function () {
        if (Meteor.isCordova) {
            this.render();
        } else {
            Router.go('marketplace', null, {replaceState: true});
        }
    }
});

if (Meteor.isCordova) {
    Router.onBeforeAction(function () {
        if (!Meteor.userId()) {
            this.render('splashView');
        } else {
            this.next();
        }
    });
}
