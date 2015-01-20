Router.route('/profile', {
    name:       'profile',
    controller: 'ProfileController'
});

ProfileController = RouteController.extend({
    layoutTemplate: 'mainLayout',
    template:       'profileView'
});
