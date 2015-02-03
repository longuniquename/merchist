(function () {

    Template.ordersViewDetails.helpers({
        'itemsCount': function () {
            var itemsCount = 0;
            _.each(this.items, function (orderItem) {
                itemsCount += orderItem.amount;
            });
            return itemsCount;
        },
        'payable':    function () {
            return this.status === 'NEW' || this.status === 'REQUESTED';
        }
    });

    Template.ordersViewDetails.events({
        'click .payWithPayPalBtn': function (e, template) {
            this.pay();
        }
    });

})();
