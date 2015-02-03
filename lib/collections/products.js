Products = new Mongo.Collection('products');

(function () {

    var ProductSchema = new SimpleSchema({
        title:                  {
            type:  String,
            label: "Title",
            max:   32
        },
        subtitle:               {
            type:     String,
            label:    "Subtitle",
            max:      64,
            optional: true
        },
        description:            {
            type:     String,
            label:    "Description",
            max:      2000,
            optional: true
        },
        price:                  {
            type:    Number,
            label:   "Price",
            min:     0.01,
            max:     10000,
            decimal: true
        },
        imageIds:               {
            type:     [String],
            label:    "Images",
            minCount: 1,
            maxCount: 10
        },
        userId:                 {
            type:  String,
            label: "Seller"
        },
        'inventory.available':  {
            type:         Number,
            label:        "Available in stock",
            defaultValue: 1,
            min:          0,
            decimal:      false
        },
        'inventory.reserved':   {
            type:         Number,
            label:        "Reserved",
            defaultValue: 0,
            min:          0,
            decimal:      false
        },
        'inventory.sold':       {
            type:         Number,
            label:        "Sold",
            defaultValue: 0,
            min:          0,
            decimal:      false
        },
        'facebookStories.sell': {
            type:     String,
            label:    "Facebook sell story",
            optional: true
        },
        'facebookStories.buy':  {
            type:     [String],
            label:    "Facebook buy stories",
            optional: true
        },
        isPublic:               {
            type:         Boolean,
            label:        "Visibility",
            defaultValue: true
        },
        createdAt:              {
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
        updatedAt:              {
            type:      Date,
            autoValue: function () {
                return new Date();
            }
        }
    });

    Products.attachSchema(ProductSchema);

})();
