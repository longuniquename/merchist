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
            Meteor.subscribe("orders");
            return Orders.find().count();
        },
        'avatar': function(){
            Meteor.subscribe("image", this.profile.avatarId);
            return Images.findOne(this.profile.avatarId);
        }
    });

    Template.mainMenu.events({
        "click .logoutBtn":     function (e) {
            e.preventDefault();
            Meteor.logout(function () {
                Router.go('marketplace');
            });
        },
        'click .createShopBtn': function (e) {
            e.preventDefault();

            var openAuthDlg = function (closed) {
                var view = Blaze.render(Template.authDlg, document.getElementsByTagName("body")[0]),
                    $dlg = $(view.templateInstance().firstNode);

                $dlg.modal('show');
                $dlg.on('hidden.bs.modal', function () {
                    Blaze.remove(view);
                    closed();
                });
            };

            var openCreateShopDlg = function () {
                var view = Blaze.render(Template.createShopDlg, document.getElementsByTagName("body")[0]),
                    $dlg = $(view.templateInstance().firstNode);

                $dlg.modal('show');
                $dlg.on('hidden.bs.modal', function () {
                    Blaze.remove(view);
                });
            };

            if (Meteor.user()) {
                openCreateShopDlg();
            } else {
                openAuthDlg(function () {
                    if (Meteor.user()) {
                        openCreateShopDlg();
                    }
                });
            }
        },
        'click .nav a':         function (e, template) {
            $(template.firstNode).modal('hide');
        },
        'click .authBtn':       function (e, template) {
            e.preventDefault();

            var view = Blaze.render(Template.authDlg, document.getElementsByTagName("body")[0]),
                $dlg = $(view.templateInstance().firstNode);

            $dlg.modal('show');
            $dlg.on('hidden.bs.modal', function (e) {
                Blaze.remove(view);
            })
        },
        'click .facebookBtn': function (e, template) {
            e.preventDefault();

            Meteor.loginWithFacebook(
                {
                    requestPermissions: ['public_profile', 'email', 'user_friends'],
                    loginStyle:         'popup'
                },
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        },
        'click .paypalBtn': function (e, template) {
            e.preventDefault();

            Meteor.loginWithPayPal(
                {
                    requestPermissions: ['REFUND', 'ACCESS_BASIC_PERSONAL_DATA', 'ACCESS_ADVANCED_PERSONAL_DATA']
                },
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        }
    });

})();
