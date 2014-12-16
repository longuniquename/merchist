(function () {

    Template.sellView.rendered = function(){

    };

    Template.sellView.helpers({

    });

    Template.sellView.events({

    });

    AutoForm.hooks({
        sellForm: {
            onSuccess: function(operation, productId, template) {
                Router.go('products.view', {_id: productId});
            }
        }
    });

})();
