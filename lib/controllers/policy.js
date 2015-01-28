Router.route('/policy', {
    name:       'policy',
    controller: 'PolicyController'
});

PolicyController = RouteController.extend({
    layoutTemplate: 'mainLayout',
    template:       'policyView'
});
