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
    },
    email: {
        type:     String,
        label:    "Contact email",
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    phone:  {
        type:     String,
        label:    "Contact phone",
        max:      24,
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
    createdAt:           {
        type: Date
    },
    services:            {
        type:     Object,
        optional: true,
        blackbox: true
    }
});

Meteor.users.attachSchema(Schema.UserSchema);
