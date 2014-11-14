(function(){

    Template.managementProductsEditGeneral.events({
        'change [name="title"]': function(e, template){
            Products.update(this._id, {$set: {title: template.$(e.currentTarget).val()}});
        },

        'change [name="subtitle"]': function(e, template){
            Products.update(this._id, {$set: {subtitle: template.$(e.currentTarget).val()}});
        },

        'change [name="description"]': function(e, template){
            Products.update(this._id, {$set: {description: template.$(e.currentTarget).val()}});
        },

        'change [name="price"]': function(e, template){
            Products.update(this._id, {$set: {price: template.$(e.currentTarget).val()}});
        },

        'change [name="shippingCost"]': function(e, template){
            Products.update(this._id, {$set: {'shipping.cost': template.$(e.currentTarget).val()}});
        },

        'change [name="shippingWeight"]': function(e, template){
            Products.update(this._id, {$set: {'shipping.weight': template.$(e.currentTarget).val()}});
        }
    });

})();