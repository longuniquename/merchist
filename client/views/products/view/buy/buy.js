(function () {

    Template.productViewBuyBlock.events({
        'click .buyBtn':   function (e, template) {
            e.preventDefault();

            Meteor.call('Orders:createFromProduct', this, function (err, order) {
                if (!err) {
                    Router.go('orders.view', order);
                }
            });
        }
    });

})();
