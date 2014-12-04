Shops = new Mongo.Collection('shops');

(function () {

    var ManagerSchema = new SimpleSchema({
        userId: {
            type: String
        },
        role:   {
            type:          String,
            allowedValues: [
                'owner',
                'seller',
                'editor'
            ]
        }
    });

    var ShopSchema = new SimpleSchema({
        title:                      {
            type:  String,
            label: "Title",
            max:   32
        },
        subtitle:                   {
            type:     String,
            label:    "Subtitle",
            max:      64,
            optional: true
        },
        description:                {
            type:     String,
            label:    "Description",
            max:      2000,
            optional: true
        },
        isPublic:                   {
            type:         Boolean,
            label:        "Visibility",
            defaultValue: true
        },
        managers:                   {
            type:     [ManagerSchema],
            minCount: 1
        },
        'tracking.googleAnalyticsId': {
            type:     String,
            label:    "Google Analytics Tracking ID",
            regEx:    /(UA|YT|MO)-\d+-\d+/i,
            optional: true
        },
        createdAt:                  {
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
        updatedAt:                  {
            type:      Date,
            autoValue: function () {
                return new Date();
            }
        }
    });

    Shops.attachSchema(ShopSchema);

})();
