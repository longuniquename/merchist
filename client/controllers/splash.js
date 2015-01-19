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
