Router.route('/', function () {
    this.redirect('/marketplace');
}, {
    name: 'root'
});

Router.route('/marketplace', function () {
    this.layout('rootLayout');
    this.render('marketplace');
}, {
    name: 'marketplace'
});

Router.route('/management/shops/new', function () {
    this.layout('rootLayout');
    this.render('shopEdit');
}, {
    name: 'shops.create'
});

Router.route('/management/shops/:shopId', function () {
    this.layout('rootLayout');
    this.render('shopEdit', {data: {shopId: this.params.shopId}});
}, {
    name: 'shops.edit'
});