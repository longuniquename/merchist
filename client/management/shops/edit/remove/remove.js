(function () {

    Template.managementShopsEditRemove.events({
        'click .removeBtn': function(e, template){
            Shops.remove(template.data._id);
            Router.go('root');
        }
    });

})();