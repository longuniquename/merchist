(function () {

    Template.productViewBuyBlock.events({
        'click .buyBtn':   function (e, template) {
            e.preventDefault();

            Meteor.call('Orders:createFromProduct', this, function (err, orderId) {
                if (!err) {
                    var order = Orders.findOne(orderId);
                    order.pay();
                }
            });
        }
    });

})();
