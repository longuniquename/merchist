Template.myShopsMenu.helpers({
    'shops': function() {
        return Shops.find({}, {sort: {title: 1}});
    }
});