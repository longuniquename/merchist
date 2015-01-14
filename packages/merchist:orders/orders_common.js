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

Orders = new Meteor.Collection("orders", {
    transform: function (doc) {
        return new Order(doc);
    }
});

Orders.attachSchema(new SimpleSchema({
    userId:              {
        type:     String,
        label:    "Buyer",
        optional: true
    },
    status:              {
        type:          String,
        label:         "Status",
        allowedValues: [
            'new'
        ]
    },
    items:               {
        type:     [Object],
        label:    "Items",
        minCount: 1
    },
    "items.$.productId": {
        type:  String,
        label: "Product"
    },
    "items.$.price":     {
        type:    Number,
        label:   "Price",
        min:     0.01,
        max:     10000,
        decimal: true
    },
    "items.$.amount":    {
        type:  Number,
        label: "Amount",
        min:   1
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
}));
