(function(){

    Template.ordersViewDetails.helpers({
        'currency': function(price){
            return '$' + Number(price).toFixed(2);
        },
        'shop': function(){
            Meteor.subscribe('shop', this.shopId);
            return Shops.findOne(this.shopId);
        },
        'logo': function(){
            Meteor.subscribe("image", this.logoId);
            return Images.findOne(this.logoId);
        },
        'itemsCount': function(){
            var itemsCount = 0;
            _.each(this.items, function(orderItem){
                itemsCount += orderItem.itemCount;
            });
            return itemsCount;
        }
    });

    Template.ordersViewDetails.events({
        'click .payWithPayPalBtn': function(e, template){
            var $btn = $(e.currentTarget).button('generating').prop('disabled', true);

            if(this.payPal && this.payPal.payKey) {
                $btn.button('redirecting');
                location.replace('https://sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=' + this.payPal.payKey);
            } else {
                Meteor.call('PayPal:getPayKey', this._id, function(err, payKey){
                    $btn.button('redirecting');
                    location.replace('https://sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=' + payKey);
                });
            }
        }
    });

})();