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
        'avatar':      function () {
            Meteor.subscribe("image", this.profile.avatarId);
            return Images.findOne(this.profile.avatarId);
        }
    });

    Template.mainMenu.events({
        "click .logoutBtn":   function (e) {
            e.preventDefault();
            Meteor.logout();
        },
        'click .nav a':       function (e, template) {
            $(template.firstNode).modal('hide');
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
        }
    });

})();
