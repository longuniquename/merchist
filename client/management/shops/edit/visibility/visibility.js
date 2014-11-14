(function(){

    Template.managementShopsEditVisibility.events({
        'change [name="isPublic"]': function(e, template){
            Shops.update(this._id, {$set: {isPublic: template.$(e.currentTarget).is(':checked')}});
        }
    });

})();