(function(){

    Template.profileDetailsSellerInfo.events({
        'change [name="email"]': function(e, template){
            Meteor.users.update(this._id, {$set: {'profile.email': template.$(e.currentTarget).val()}});
        },
        'change [name="phone"]': function(e, template){
            Meteor.users.update(this._id, {$set: {'profile.phone': template.$(e.currentTarget).val()}});
        }
    });

})();
