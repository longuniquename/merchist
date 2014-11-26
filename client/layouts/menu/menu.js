(function () {

    Template.mainMenu.helpers({
        'shops':       function () {
            if (Meteor.user()) {
                Meteor.subscribe("myShops");
                return Shops.find({"managers.userId": Meteor.userId()}, {sort: {title: 1}});
            } else {
                return false;
            }
        },
        'logo':        function () {
            Meteor.subscribe("image", this.logoId);
            return Images.findOne(this.logoId);
        },
        'ordersCount': function () {
            var cartId = localStorage["cartId"];
            Meteor.subscribe("myOrders", cartId);
            return Orders.find().fetch().length;
        }
    });

    Template.mainMenu.events({
        "click .overlay":               function (e, template) {
            template.$('#mainMenu').removeClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'menu',
                'eventAction':   'close',
                'eventLabel':    'Menu closed'
            });
        },
        "click .closeBtn":              function (e, template) {
            template.$('#mainMenu').removeClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'menu',
                'eventAction':   'close',
                'eventLabel':    'Menu closed'
            });
        },
        "click .logoutBtn":             function (e) {
            e.preventDefault();
            Meteor.logout(function () {
                Router.go('marketplace');
            });
        },
        'click .createShopBtn':         function (e) {
            e.preventDefault();
            if (Meteor.user()) {
                Router.go(
                    'shops.edit',
                    {
                        _id: Shops.insert({
                            managers: [
                                {
                                    userId: Meteor.userId(),
                                    role:   'owner'
                                }
                            ]
                        })
                    }
                );
            } else {

            }
        },
        'click .nav a':                 function (e, template) {
            template.$('#mainMenu').removeClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'menu',
                'eventAction':   'close',
                'eventLabel':    'Menu closed'
            });
        },
        'click .profile .actions .btn': function (e, template) {
            template.$('#mainMenu').removeClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'menu',
                'eventAction':   'close',
                'eventLabel':    'Menu closed'
            });
        },
        'click .authBtn': function(e, template){
            e.preventDefault();

            var view = Blaze.render(Template.authDlg, document.getElementsByTagName("body")[0]),
                $dlg = $(view.templateInstance().firstNode);

            $dlg.modal('show');
            $dlg.on('hidden.bs.modal', function (e) {
                Blaze.remove(view);
            })
        }
    });

})();
