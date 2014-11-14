Template.myShopsMenu.helpers({
    'shops': function () {
        return Shops.find({}, {sort: {title: 1}});
    }
});

Template.myShopsMenu.events({
    'click .createShopBtn': function (e, template) {
        e.preventDefault();
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
    }
});