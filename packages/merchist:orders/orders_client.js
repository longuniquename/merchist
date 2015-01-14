Order.prototype.pay = function () {
    window.open(Meteor.absoluteUrl('_orders/pay?orderId=' + this._id), Meteor.isCordova ? '_system' : '_blank');
};
