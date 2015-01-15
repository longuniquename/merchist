OrdersSchema = new SimpleSchema({
    userId:              {
        type:     String,
        label:    "Buyer",
        optional: true
    },
    sellerId:            {
        type:      String,
        label:     "Seller",
        autoValue: function () {
            if (this.isInsert || this.isUpsert) {
                var orderItem = this.field('items').value[0],
                    product = Products.findOne(orderItem.productId);

                if (this.isInsert) {
                    return product.userId;
                } else if (this.isUpsert) {
                    return {$setOnInsert: product.userId};
                }

            } else {
                this.unset();
            }
        }
    },
    connectionId:              {
        type:     String,
        label:    "Connection"
    },
    status:              {
        type:          String,
        label:         "Status",
        allowedValues: [
            'NEW',
            'CANCELED',
            'CREATED',
            'PROCESSING',
            'PENDING',
            'COMPLETED',
            'INCOMPLETE',
            'ERROR',
            'REVERSALERROR'
        ]
    },
    items:               {
        type:     [Object],
        label:    "Items",
        minCount: 1,
        custom:   function () {
            var self = this;
            if (Meteor.isServer) {
                var productsIds = [],
                    valid = true;
                _.each(this.value, function (orderItem) {
                    productsIds.push(orderItem.productId);
                });

                Products.find({_id: {$in: productsIds}}).forEach(function (product) {
                    if (product.userId !== self.field('sellerId').value) {
                        valid = false;
                    }
                });

                if (!valid) {
                    return 'Products in order belong to different sellers';
                }
            }
        }
    },
    "items.$.productId": {
        type:   String,
        label:  "Product",
        custom: function () {
            if (Meteor.isServer) {
                if (!Products.findOne(this.value)) {
                    return 'Product does not exists';
                }
            }
        }
    },
    "items.$.price":     {
        type:      Number,
        label:     "Price",
        min:       0.01,
        max:       10000,
        decimal:   true,
        autoValue: function () {
            var product = Products.findOne(this.siblingField('productId').value);
            if (product && product.price) {
                if (this.isInsert) {
                    return product.price;
                } else if (this.isUpsert) {
                    return {$setOnInsert: product.price};
                } else {
                    this.unset();
                }
            } else {
                return 'Product has no price';
            }
        }
    },
    "items.$.amount":    {
        type:  Number,
        label: "Amount",
        min:   1
    },
    "paypal.payKey":     {
        type:     String,
        label:    "PayKey",
        optional: true
    },
    createdAt:           {
        type:      Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    },
    updatedAt:           {
        type:      Date,
        autoValue: function () {
            return new Date();
        }
    }
});

Orders.attachSchema(OrdersSchema);
