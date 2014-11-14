(function(){

    Template.managementProductsEditGeneral.helpers({
        isInStock: function(){
            return this.availability == 'inStock';
        },
        isOutOfStock: function(){
            return this.availability == 'outOfStock';
        },
        isNew: function(){
            return this.condition == 'new';
        },
        isUsed: function(){
            return this.condition == 'used';
        }
    });

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
        },

        'change [name="availability"]': function(e, template){
            Products.update(this._id, {$set: {availability: template.$(e.currentTarget).val()}});
        },

        'change [name="condition"]': function(e, template){
            Products.update(this._id, {$set: {condition: template.$(e.currentTarget).val()}});
        }
    });

})();