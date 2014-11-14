(function () {
    Template.marketplace.events({
        'click .menuBtn': function(e){
            e.preventDefault();
            $('nav#menu').show();
        }
    });
})();
