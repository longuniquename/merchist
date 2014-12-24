(function(){

    Template.profileDetailsBasicInfo.helpers({
        schema: function(){
            return new SimpleSchema({
                'profile.firstName': {
                    type:     String,
                    label:    "First name",
                    max:      32
                },
                'profile.lastName': {
                    type:     String,
                    label:    "Last name",
                    max:      32
                }
            });
        }
    });

    AutoForm.hooks({
        basicInfoForm: {
            onSubmit: function(insertDoc, updateDoc, currentDoc) {
                this.event.preventDefault();
                Meteor.users.update(Meteor.userId(), updateDoc);
                this.done();
            }
        }
    });

})();
