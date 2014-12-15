(function(){

    Template.mainToolbar.helpers({
        'showCart':  function () {
            var cartId = localStorage["cartId"];
            return !!CartItems.find({cartId: cartId}).fetch().length;
        }
    });

    Template.mainToolbar.events({
        "click .menuBtn": function(e, template){
            e.preventDefault();
            $('#mainMenu').modal('toggle');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'menu',
                'eventAction':   'open',
                'eventLabel':    'Menu opened'
            });
        },
        "click .cartBtn": function(e, template){
            e.preventDefault();
            $('#cart .cart-view').modal('toggle');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'cart',
                'eventAction':   'open',
                'eventLabel':    'Cart opened'
            });
        }
    });

})();
