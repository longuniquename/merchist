(function(){

    Template.rootLayout.events({
        'click .menuBtn': function(e){
            e.preventDefault();
            $('nav#menu').show();
        }
    });

})();