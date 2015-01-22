(function () {

    Template.managementProductsEditRemove.events({
        'click .removeBtn': function(e, template){
            Products.remove(template.data._id);
            Router.go('marketplace');
        }
    });

})();
