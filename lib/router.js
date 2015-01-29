if (Meteor.isCordova) {
    Router.onBeforeAction(function () {
        if (!Meteor.userId()) {
            this.layout(null);
            this.render('splashView');
        } else {
            this.next();
        }
    }, {
        except: ['policy', 'terms']
    });
} else {
    Router.onBeforeAction(function () {
        if (!Meteor.userId()) {
            this.render('authView');
        } else {
            this.next();
        }
    }, {
        only: ['products.my', 'orders', 'profile']
    });
}

Router.configure({
    progressSpinner: false,
    progress:        true
});
