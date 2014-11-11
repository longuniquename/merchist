Router.route('/', function () {
    this.redirect('/marketplace');
});

Router.route('/marketplace', function () {
    this.render('marketplace');
});

Router.route('/management', function () {
    this.render('management');
});