(function(){

    Template.managementShopsEditGeneral.events({
        'change [name="title"]': function(e, template){
            Shops.update(this._id, {$set: {title: template.$(e.currentTarget).val()}});
        },

        'change [name="subtitle"]': function(e, template){
            Shops.update(this._id, {$set: {subtitle: template.$(e.currentTarget).val()}});
        },

        'change [name="description"]': function(e, template){
            Shops.update(this._id, {$set: {description: template.$(e.currentTarget).val()}});
        },

        'change [name="tax"]': function(e, template){
            Shops.update(this._id, {$set: {'payments.tax': template.$(e.currentTarget).val()}});
        }
    });

})();