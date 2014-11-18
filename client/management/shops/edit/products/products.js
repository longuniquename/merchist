(function () {

    Template.managementShopsEditProducts.rendered = function () {
        this.$('[data-toggle="tooltip"]').tooltip();
    };

    Template.managementShopsEditProducts.helpers({
        products: function () {
            Meteor.subscribe("shopProducts", this._id);
            return Products.find({shopId: this._id});
        },

        image: function(){
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
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