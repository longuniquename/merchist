(function(){

    Template.productCardPartial.helpers({
        image:   function () {
            if (this.imageIds && this.imageIds.length) {
                Meteor.subscribe("image", this.imageIds[0]);
                return Images.findOne(this.imageIds[0]);
            }
        },
        isMy: function(){
            return this.userId === Meteor.userId();
        }
    });

    Template.productCardPartial.events({
        'click .buyBtn': function(e, template){
            e.preventDefault();

            var order = new Order({
                items:  [
                    {
                        productId: this._id,
                        price:     this.price,
                        amount:    1
                    }
                ],
                status: 'new'
            });

            if (Meteor.userId()) {
                order.userId = Meteor.userId();
            }

            Router.go('orders.view', {_id: Orders.insert(order)});
        }
    });

})();
