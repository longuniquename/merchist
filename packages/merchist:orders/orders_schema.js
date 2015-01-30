PayPalPaymentSchema = new SimpleSchema({
    payKey:                            {
        type:  String,
        label: "Payment Key"
    },
    status:                            {
        type:          String,
        label:         "Payment Status",
        allowedValues: [
            'CANCELED',
            'CREATED',
            'COMPLETED',
            'INCOMPLETE',
            'ERROR',
            'REVERSALERROR',
            'PROCESSING',
            'PENDING'
        ]
    },
    transactionType:                   {
        type:     String,
        label:    "Transaction Type",
        optional: true
    },
    senderEmail:                       {
        type:     String,
        regEx:    SimpleSchema.RegEx.Email,
        label:    "Sender Email",
        optional: true
    },
    actionType:                        {
        type:          String,
        label:         "Action Type",
        allowedValues: [
            'PAY',
            'CREATE'
        ],
        optional:      true
    },
    paymentRequestDate:                {
        type:     Date,
        label:    "Payment Request Date",
        optional: true
    },
    reverseAllParallelPaymentsOnError: {
        type:     Boolean,
        label:    "Reverse All Parallel Payments On Error",
        optional: true
    },
    memo:                              {
        type:     String,
        label:    "Memo",
        optional: true
    },
    feesPayer:                         {
        type:          String,
        label:         "Fees Payer",
        allowedValues: [
            'SENDER',
            'PRIMARYRECEIVER',
            'EACHRECEIVER',
            'SECONDARYONLY'
        ],
        optional:      true
    },
    trackingId:                        {
        type:     String,
        label:    "Tracking ID",
        optional: true
    },
    preapprovalKey:                    {
        type:     String,
        label:    "Preapproval Key",
        optional: true
    },
    reasonCode:                        {
        type:     String,
        label:    "Reason Code",
        optional: true
    },
    payKeyExpirationDate:              {
        type:     Date,
        label:    "PayKey Expiration Date",
        optional: true
    },
    currencyCode:                      {
        type:          String,
        label:         "Currency Code",
        allowedValues: [
            'AUD',
            'BRL',
            'CAD',
            'CZK',
            'DKK',
            'EUR',
            'HKD',
            'HUF',
            'ILS',
            'JPY',
            'MYR',
            'MXN',
            'NOK',
            'NZD',
            'PHP',
            'PLN',
            'GBP',
            'SGD',
            'SEK',
            'CHF',
            'TWD',
            'THB',
            'TRY',
            'USD'
        ],
        optional:      true
    }
});

OrdersSchema = new SimpleSchema({
    uid:                 {
        type:      String,
        label:     "Universally unique identifier",
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.uuid();
            } else if (this.isUpsert) {
                return {$setOnInsert: Meteor.uuid()};
            } else {
                this.unset();
            }
        }
    },
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
    connectionId:        {
        type:  String,
        label: "Connection"
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
    paypal:              {
        type:     PayPalPaymentSchema,
        label:    "PayPal Payment",
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
