Template.myShopsMenu.helpers({
    'shops': function () {
        if (Meteor.user()) {
            Meteor.subscribe("myShops");
            return Shops.find({"managers.userId": Meteor.userId()}, {sort: {title: 1}});
        } else {
            return false;
        }
    }
});

Template.myShopsMenu.events({
    'click .createShopBtn': function (e, template) {
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
    }
});