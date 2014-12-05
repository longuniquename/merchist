(function () {

    var metaKey;

    Template.marketplaceProductsViewDetails.rendered = function () {
        metaKey = Blaze.Meta.registerMeta({
            'og:type':                'product',
            'og:url':                 Router.url('products.view', this.data),
            'og:title':               this.data.title,
            'og:description':         this.data.description,
            'product:price:amount':   this.data.price,
            'product:price:currency': 'USD',
            'al:android:url':         'merchist://' + Router.path('products.view', this.data).replace(/^\/+/, ''),
            'al:android:package':     'com.merchist.client',
            //'al:android:class':       'Merchist',
            'al:android:app_name':    'Merchist'
        });
    };

    Template.marketplaceProductsViewDetails.destroyed = function () {
        Blaze.Meta.unregisterMeta(metaKey);
    };

    Template.marketplaceProductsViewDetails.helpers({
        'inCart':     function () {
            var cartId = localStorage["cartId"];
            return !!CartItems.findOne({cartId: cartId, productId: this._id});
        },
        'paragraphs': function (text) {
            if (text) {
                return _.filter(text.split("\n"), function (paragraph) {
                    return !!paragraph.length;
                });
            }
        }
    });

    Template.marketplaceProductsViewDetails.events({
        'click .buyBtn':      function (e, template) {
            var cartId = localStorage["cartId"];

            var cartItem = CartItems.findOne({cartId: cartId, productId: this._id});

            if (!cartItem) {
                CartItems.insert({cartId: cartId, productId: this._id, quantity: 1});
            }

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'button',
                'eventAction':   'click',
                'eventLabel':    'Buy button'
            });
        },
        'click .showCartBtn': function (e, template) {
            e.preventDefault();
            $('#cart').addClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'cart',
                'eventAction':   'open',
                'eventLabel':    'Cart opened'
            });
        }
    });

})(Template);