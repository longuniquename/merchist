(function () {

    Template.sellDlg.created = function () {
        Meteor.subscribe("myShops");
    };

    Template.sellDlg.helpers({
        shops:    function () {
            return Shops.find({"managers.userId": Meteor.userId()}, {sort: {title: 1}});
        },
        hasShops: function () {
            return Shops.find({"managers.userId": Meteor.userId()}).fetch().length;
        }
    });

    Template.sellDlg.events({
        'submit form':        function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            var title = template.$('[name="title"]').val(),
                price = template.$('[name="price"]').val(),
                shopId = template.$('[name="shopId"]').val();

            if (!shopId) {
                var newShop = {
                    title: 'My awesome new shop',
                    managers: [
                        {
                            userId: Meteor.userId(),
                            role: 'owner'
                        }
                    ]
                };
                if (Meteor.user().profile && Meteor.user().profile.firstName) {
                    newShop.title = Meteor.user().profile.firstName + '\'s shop';
                }
                shopId = Shops.insert(newShop);
            }

            var productId = Products.insert({title: title, price: price, shopId: shopId});
            Router.go('products.view', {_id: productId});
            $dlg.modal('hide');
        },
        'click .facebookBtn': function (e, template) {
            e.preventDefault();

            Meteor.loginWithFacebook(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                }
            );
        },
        'click .googleBtn':   function (e, template) {
            e.preventDefault();

            Meteor.loginWithGoogle(
                {
                    requestPermissions: ['email'],
                    loginStyle:         'popup'
                }
            );
        },
        'click .twitterBtn':  function (e, template) {
            e.preventDefault();

            Meteor.loginWithTwitter(
                {
                    loginStyle: 'popup'
                }
            );
        }
    });

})();