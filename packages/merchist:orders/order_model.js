Order = function (doc) {
    _.extend(this, doc);
};

Order.prototype = {
    constructor: Order,
    total:       function () {
        var total = 0;
        _.each(this.items, function (item) {
            total += item.price * item.amount;
        });
        return total;
    }
};
