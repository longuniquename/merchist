(function(){

    Template.mainToolbar.events({
        "click .menuBtn": function(e, template){
            e.preventDefault();
            $('#mainMenu').addClass('visible');
        }
    });

})();
