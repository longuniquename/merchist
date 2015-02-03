(function () {

    Template.productCardPartial.helpers({
        image: function () {
            if (this.imageIds && this.imageIds.length) {
                Meteor.subscribe("image", this.imageIds[0]);
                return Images.findOne(this.imageIds[0]);
            }
        },
        isMy:  function () {
            return this.userId === Meteor.userId();
        }
    });

    Template.productCardPartial.events({
        'click .buyBtn':   function (e, template) {
            e.preventDefault();

            Meteor.call('Orders:createFromProduct', this, function (err, orderId) {
                if (!err) {
                    var order = Orders.findOne(orderId);
                    Router.go('orders.view', order);
                    order.pay();
                }
            });
        },
        'click .shareBtn': function (e, template) {
            e.preventDefault();

            console.log(this);

            FB.ui(
                {
                    method: 'share',
                    href:   Router.url('product', this)
                }
            );
        }
    });

})();
