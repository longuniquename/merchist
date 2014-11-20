(function(){

    Template.profileDetailsBasicInfo.events({
        'change [name="firstName"]': function(e, template){
            Meteor.users.update(this._id, {$set: {'profile.firstName': template.$(e.currentTarget).val()}});
        },
        'change [name="lastName"]': function(e, template){
            Meteor.users.update(this._id, {$set: {'profile.lastName': template.$(e.currentTarget).val()}});
        }
    });

})();