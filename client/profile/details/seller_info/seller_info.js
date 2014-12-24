(function(){

    Template.profileDetailsSellerInfo.helpers({
        schema: function(){
            return new SimpleSchema({
                'profile.email': {
                    type:     String,
                    label:    "Contact email",
                    regEx:    SimpleSchema.RegEx.Email,
                    optional: true
                },
                'profile.phone': {
                    type:     String,
                    label:    "Contact phone",
                    max:      24,
                    optional: true
                }
            });
        }
    });

    AutoForm.hooks({
        sellerInfoForm: {
            onSubmit: function(insertDoc, updateDoc, currentDoc) {
                this.event.preventDefault();
                Meteor.users.update(Meteor.userId(), updateDoc);
                this.done();
            }
        }
    });

})();
