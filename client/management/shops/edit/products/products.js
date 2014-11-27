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
            var view = Blaze.renderWithData(Template.createProductDlg, this, document.getElementsByTagName("body")[0]);
            var    $dlg = $(view.firstNode());

            $dlg.modal('show');
            $dlg.on('hidden.bs.modal', function () {
                Blaze.remove(view);
            });
        }
    });

})();
