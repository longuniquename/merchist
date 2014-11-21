Template.menu.helpers({
    'ordersCount': function(){
        var cartId = localStorage["cartId"];
        Meteor.subscribe("myOrders", cartId);
        return Orders.find().fetch().length;
    }
});

Template.menu.events({
    'click .closeBtn': function(e){
        $('nav#menu').hide();
    }
});
