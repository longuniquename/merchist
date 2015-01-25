(function () {

    Template.productEditRemoveBlock.events({
        'click .removeBtn': function(e, template){
            if (confirm("Are you sure?")) {
                Products.remove(template.data._id);
                Router.go('marketplace');
            }
        }
    });

})();
