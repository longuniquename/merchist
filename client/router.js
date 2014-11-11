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
    this.render('shopEdit', {data: {shop: {}}});
}, {
    name: 'shops.create'
});

Router.route('/management/shops/:shopId', function () {
    var shop = Shops.findOne(this.params.shopId);
    this.layout('rootLayout');
    this.render('shopEdit', {data: {shop: shop}});
}, {
    name: 'shops.edit'
});