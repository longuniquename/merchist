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
    this.render('shopEdit', {data:{shop:{}}});
}, {
    name: 'shops.create'
});

Router.route('/management/shops/:_id', function () {
    var shopId = this.params._id;

    this.layout('rootLayout');
    this.wait(Meteor.subscribe('shop', shopId));

    if (this.ready()) {
        this.render('shopEdit', {
            data: {
                shop: function () {
                    return Shops.findOne({_id: shopId});
                }
            }
        });
    } else {
        this.render('loading');
    }
}, {
    name: 'shops.edit'
});