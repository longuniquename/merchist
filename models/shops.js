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
        title:                       {
            type:  String,
            label: "Title",
            max:   200
        },
        subtitle:                    {
            type:     String,
            label:    "Subtitle",
            max:      200,
            optional: true
        },
        description:                 {
            type:     String,
            label:    "Description",
            max:      1000,
            optional: true
        },
        tax:                         {
            type:     Number,
            label:    "Tax rate",
            min:      0,
            max:      100,
            decimal:  true,
            optional: true
        },
        managers:                    {
            type:     [ManagerSchema],
            minCount: 1
        },
        createdAt:                   {
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
        updatedAt:                   {
            type:      Date,
            autoValue: function () {
                return new Date();
            }
        },
        history:                     {
            type:      [Object],
            optional:  true,
            autoValue: function () {
                var form = this,
                    updatedFields = {};

                _.each(['title', 'subtitle', 'description', 'tax'], function (name) {
                    var field = form.field(name);
                    if (field.isSet) {
                        updatedFields[name] = field.value;
                    }
                });

                if (_.keys(updatedFields).length) {
                    if (this.isInsert) {
                        return [{
                            date:   new Date,
                            doc:    updatedFields,
                            userId: Meteor.userId()
                        }];
                    } else {
                        return {
                            $push: {
                                date:   new Date,
                                doc:    updatedFields,
                                userId: Meteor.userId()
                            }
                        };
                    }
                }
            }
        },
        'history.$.date':            {
            type: Date
        },
        'history.$.doc':             {
            type: Object
        },
        'history.$.doc.title':       {
            type:     String,
            optional: true
        },
        'history.$.doc.subtitle':    {
            type:     String,
            optional: true
        },
        'history.$.doc.description': {
            type:     String,
            optional: true
        },
        'history.$.doc.tax':         {
            type:     Number,
            optional: true
        },
        'history.$.userId':          {
            type: String
        }
    });

    //Shops.attachSchema(ShopSchema);

})();

