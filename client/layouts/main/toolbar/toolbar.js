(function(){

    Template.mainToolbar.rendered = function(){
        $(document).bind('scroll', function(e){
            if ($(document).scrollTop()) {
                $('#mainToolbar').addClass('navbar-raised');
            } else {
                $('#mainToolbar').removeClass('navbar-raised');
            }
        });
    };

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
        }
    });

})();
