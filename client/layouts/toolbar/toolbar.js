(function(){

    Template.mainToolbar.events({
        "click .menuBtn": function(e, template){
            e.preventDefault();
            $('#mainMenu').addClass('visible');

            ga('send', {
                'hitType':       'event',
                'eventCategory': 'menu',
                'eventAction':   'open',
                'eventLabel':    'Menu opened'
            });
        }
    });

})();
