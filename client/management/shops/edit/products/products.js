(function () {

    Template.managementShopsEditProducts.helpers({
        products: function () {
            Meteor.subscribe("shopProducts", this._id);
            return Products.find({shopId: this._id});
        }
    });

    Template.managementShopsEditProducts.events({
        'click .createProductBtn': function (e, template) {
            Router.go(
                'products.edit',
                {
                    _id: Products.insert(
                        {
                            shopId: template.data._id
                        }
                    )
                }
            );
        }
    });

})();