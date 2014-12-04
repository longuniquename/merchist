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

    var PayPalAccountSchema = new SimpleSchema({
        id:                           {
            type: String
        },
        token:                        {
            type: String
        },
        tokenSecret:                  {
            type: String
        },
        type:                         {
            type:          String,
            allowedValues: [
                'BUSINESS'
            ]
        },
        verified:                     {
            type: Boolean
        },
        scope:                        {
            type: [String]
        },
        'profile.firstName':          {
            type:     String,
            optional: true
        },
        'profile.lastName':           {
            type:     String,
            optional: true
        },
        'profile.company':            {
            type:     String,
            optional: true
        },
        'contact.email':              {
            type: String
        },
        'contact.phone':              {
            type:     String,
            optional: true
        },
        'contact.address.country':    {
            type:     String,
            optional: true
        },
        'contact.address.state':      {
            type:     String,
            optional: true
        },
        'contact.address.city':       {
            type:     String,
            optional: true
        },
        'contact.address.postalCode': {
            type:     String,
            optional: true
        },
        'contact.address.street1':    {
            type:     String,
            optional: true
        },
        'contact.address.street2':    {
            type:     String,
            optional: true
        }
    });

    var ShopSchema = new SimpleSchema({
        title:                        {
            type:  String,
            label: "Title",
            max:   32
        },
        subtitle:                     {
            type:     String,
            label:    "Subtitle",
            max:      64,
            optional: true
        },
        description:                  {
            type:     String,
            label:    "Description",
            max:      2000,
            optional: true
        },
        isPublic:                     {
            type:         Boolean,
            label:        "Visibility",
            defaultValue: true
        },
        logoId:                       {
            type:     String,
            label:    "Logo",
            optional: true
        },
        managers:                     {
            type:     [ManagerSchema],
            label:    "Managers",
            minCount: 1
        },
        'payments.tax':               {
            type:         Number,
            label:        "Tax rate",
            min:          0,
            max:          100,
            defaultValue: 0,
            decimal:      true
        },
        'payments.PayPal.account':            {
            type:     PayPalAccountSchema,
            label:    "PayPal Account",
            optional: true
        },
        'tracking.googleAnalyticsId': {
            type:     String,
            label:    "Google Analytics Tracking ID",
            regEx:    /(UA|YT|MO)-\d+-\d+/i,
            optional: true
        },
        createdAt:                    {
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
        updatedAt:                    {
            type:      Date,
            autoValue: function () {
                return new Date();
            }
        }
    });

    Shops.attachSchema(ShopSchema);

})();
