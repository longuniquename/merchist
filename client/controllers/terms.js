Router.route('/terms', {
    name:       'terms',
    controller: 'TermsController'
});

TermsController = RouteController.extend({
    layoutTemplate: 'mainLayout',
    template:       'termsView'
});
