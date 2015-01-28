if (typeof Schema === 'undefined') {
    Schema = {};
}

Schema.UserProfileSchema = new SimpleSchema({
    avatarId:  {
        type:     String,
        label:    "Avatar",
        optional: true
    },
    firstName: {
        type:     String,
        label:    "First name",
        max:      32,
        optional: true
    },
    lastName:  {
        type:     String,
        label:    "Last name",
        max:      32,
        optional: true
    }
});

Schema.UserSchema = new SimpleSchema({
    profile:             {
        type:  Schema.UserProfileSchema,
        label: "Profile"
    },
    emails:              {
        type:     [Object],
        optional: true
    },
    "emails.$.address":  {
        type:  String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    services:            {
        type:     Object,
        optional: true,
        blackbox: true
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

Meteor.users.attachSchema(Schema.UserSchema);
