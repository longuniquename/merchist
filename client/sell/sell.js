(function () {

    Template.sellView.rendered = function(){

    };

    Template.sellView.helpers({

    });

    Template.sellView.events({

    });

    AutoForm.hooks({
        sellForm: {
            before: {
                insert: function(doc, template) {
                    doc.userId = Meteor.userId();
                    return doc;
                }
            },
            onSuccess: function(operation, productId, template) {
                Router.go('products.view', {_id: productId});
            }
        }
    });

})();
