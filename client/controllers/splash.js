SplashController = RouteController.extend({
    template: 'splash',

    action: function () {
        if (Meteor.isCordova) {
            this.render();
        } else {
            Router.go('marketplace', null, {replaceState: true});
        }
    }
});
