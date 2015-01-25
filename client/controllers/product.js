Router.route('/products/:_id', {
    name:       'product',
    controller: 'ProductController'
});

ProductController = RouteController.extend({
    layoutTemplate: 'mainLayout',

    loadingTemplate: 'loadingView',
    template:        'productView',
    editingTemplate: 'productEditView',

    waitOn: function () {
        return [
            Meteor.subscribe('product', this.params._id),
            Meteor.subscribe('productImages', this.params._id),
            Meteor.subscribe("serviceConfiguration", 'facebook')
        ];
    },

    data: function () {
        var self = this;
        return {
            product: function () {
                return Products.findOne(self.params._id);
            },
            images:  function () {
                if (this.product()) {
                    return Images.find({_id: {$in: this.product().imageIds}})
                }
            }
        }
    },

    action: function () {
        var product = this.data().product();

        if (!product) {
            this.render('productNotFoundView');
            return;
        }

        var images = this.data().images(),
            facebookConfig = ServiceConfiguration.configurations.findOne({service: 'facebook'});

        OgMeta.add('fb:app_id', facebookConfig.appId);
        OgMeta.add('og:site_name', 'Merchist');
        OgMeta.add('og:type', 'product');
        OgMeta.add('og:url', Router.url('product', product));
        OgMeta.add('og:title', product.title);
        OgMeta.add('og:description', product.description);
        OgMeta.add('product:price:amount', product.price);
        OgMeta.add('product:price:currency', 'USD');
        OgMeta.add('al:android:url', 'merchist://' + Router.path('product', product).replace(/^\/+/, ''));
        OgMeta.add('al:android:package', 'com.merchist.client');
        OgMeta.add('al:android:app_name', 'Merchist');

        images.forEach(function (image, index) {
            var parser = document.createElement('a');
            parser.href = image.url({store: 'm', auth: false, download: true});
            OgMeta.add('og:image', 'http://' + parser.host + parser.pathname + parser.search);
        });

        if (Meteor.userId() && product.userId === Meteor.userId()) {
            this.render(this.editingTemplate);
        } else {
            this.render();
        }

    }
});
