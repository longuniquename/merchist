(function(){

    Template.managementShopsEditHistory.helpers({
        'user': function(){
            Meteor.subscribe("user", this.userId);
            return Meteor.users.findOne(this.userId);
        }
    });

})();