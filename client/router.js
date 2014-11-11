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

Router.route('/management', function () {
    this.layout('rootLayout');
    this.render('management');
}, {
    name: 'management'
});

Router.route('/management/shops/new', function () {
    this.layout('internalLayout');
    this.render('shopEdit', {data: {shop: {}}});
}, {
    name: 'management.shops.create'
});

Router.route('/management/shops/:shopId', function () {
    var shop = Shops.findOne(this.params.shopId);
    this.layout('internalLayout');
    this.render('shopEdit', {data: {shop: shop}});
}, {
    name: 'management.shops.edit'
});