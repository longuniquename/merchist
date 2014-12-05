Products = new Mongo.Collection('products');

(function () {

    var ProductSchema = new SimpleSchema({
        title:                     {
            type:  String,
            label: "Title",
            max:   32
        },
        subtitle:                  {
            type:     String,
            label:    "Subtitle",
            max:      64,
            optional: true
        },
        description:               {
            type:     String,
            label:    "Description",
            max:      2000,
            optional: true
        },
        price:                     {
            type:     Number,
            label:    "Price",
            min:      0.01,
            max:      10000,
            decimal:  true,
            optional: true
        },
        available:                 {
            type:         Number,
            label:        "Available in stock",
            defaultValue: 1
        },
        'shipping.cost':           {
            type:     Number,
            label:    "Shipping",
            min:      0.01,
            max:      10000,
            decimal:  true,
            optional: true
        },
        images:                    {
            type:     [String],
            label:    "Images",
            maxCount: 10,
            optional: true
        },
        'attributes.ageGroup':     {
            type:          String,
            allowedValues: [
                'kids',
                'adult'
            ],
            optional:      true
        },
        'attributes.condition':    {
            type:          String,
            allowedValues: [
                'new',
                'refurbished',
                'used'
            ],
            optional:      true
        },
        'attributes.targetGender': {
            type:          String,
            allowedValues: [
                'female',
                'male',
                'unisex'
            ],
            optional:      true
        },
        shopId:                    {
            type:     String,
            label:    "Shop",
            optional: true
        },
        userId:                    {
            type:     String,
            label:    "Seller",
            optional: true
        },
        isPublic:                  {
            type:         Boolean,
            label:        "Visibility",
            defaultValue: true
        },
        createdAt:                 {
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
        updatedAt:                 {
            type:      Date,
            autoValue: function () {
                return new Date();
            }
        }
    });

})();
