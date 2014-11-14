(function(){

    Template.managementProductsEditVisibility.events({
        'change [name="isPublic"]': function(e, template){
            Products.update(this._id, {$set: {isPublic: template.$(e.currentTarget).is(':checked')}});
        }
    });

})();