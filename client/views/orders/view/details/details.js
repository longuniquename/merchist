(function () {

    var expiresIn = new ReactiveVar(null);

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
        },
        'expiresIn':    function () {
            if (this.paypal && this.paypal.payKeyExpirationDate) {
                var self = this;
                Meteor.setTimeout(function(){
                    var expirationMs = self.paypal.payKeyExpirationDate.getTime() - (new Date()).getTime(),
                        expirationS = Math.floor(expirationMs / 1000),
                        expirationM = Math.floor(expirationMs / 60000);
                    if (expirationM > 0) {
                        expiresIn.set(expirationM + ' minutes');
                    } else if (expirationS > 0){
                        expiresIn.set(expirationM + ' seconds');
                    } else {
                        expiresIn.set('Less then a second');
                    }
                }, 1000);
            }
            return expiresIn.get();
        }
    });

    Template.ordersViewDetails.events({
        'click .payWithPayPalBtn': function (e, template) {
            this.pay();
        }
    });

})();
