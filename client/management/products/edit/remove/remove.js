(function () {

    Template.managementProductsEditRemove.events({
        'click .removeBtn': function(e, template){
            var shopId = template.data.shopId;
            Products.remove(template.data._id);
            Router.go('shops.edit', {_id: shopId});
        }
    });

})();