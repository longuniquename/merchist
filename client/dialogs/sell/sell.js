(function () {

    Template.sellDlg.created = function () {
        Meteor.subscribe("myShops");
    };

    Template.sellDlg.helpers({
        shops:       function () {
            Session.set('currentShop', Shops.find({"managers.userId": Meteor.userId()}, {sort: {title: 1}}).fetch()[0]);
            return Shops.find({"managers.userId": Meteor.userId()}, {sort: {title: 1}});
        },
        hasShops:    function () {
            return Shops.find({"managers.userId": Meteor.userId()}).fetch().length;
        },
        currentShop: function () {
            return Session.get('currentShop');
        }
    });

    Template.sellDlg.events({
        'click .setCurrentShopBtn': function (e, template) {
            e.preventDefault();
            Session.set('currentShop', this);
        },
        'submit form':              function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            var title = template.$('[name="title"]').val(),
                price = template.$('[name="price"]').val();

            var shop = Session.get('currentShop');

            if (!shop) {
                var newShop = {
                    title:    'My awesome new shop',
                    managers: [
                        {
                            userId: Meteor.userId(),
                            role:   'owner'
                        }
                    ]
                };
                if (Meteor.user().profile && Meteor.user().profile.firstName) {
                    newShop.title = Meteor.user().profile.firstName + '\'s shop';
                }
                shop = Shops.findOne(Shops.insert(newShop));
            }

            var productId = Products.insert({
                title:    title,
                price:    price,
                shopId:   shop._id,
                isPublic: true
            });

            FB.api(
                'me/merchist_staging:sell',
                'post',
                {
                    product:                Router.url('products.view', {_id: productId}),
                    privacy:                {'value': 'SELF'},
                    expires_in:             60 * 60 * 24 * 365 * 100,
                    'fb:explicitly_shared': true
                },
                function (response) {
                    console.log(response);
                }
            );

            Router.go('products.view', {_id: productId});
            $dlg.modal('hide');
        },
        'click .facebookBtn':       function (e, template) {
            e.preventDefault();

            Meteor.loginWithFacebook(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                }
            );
        },
        'click .googleBtn':         function (e, template) {
            e.preventDefault();

            Meteor.loginWithGoogle(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                }
            );
        },
        'click .twitterBtn':        function (e, template) {
            e.preventDefault();

            Meteor.loginWithTwitter(
                {
                    loginStyle: 'popup'
                }
            );
        }
    });

})();