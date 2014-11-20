(function(){

    Template.managementShopsEditManagers.helpers({
        'manager': function(){
            Meteor.subscribe("user", this.userId);
            return Meteor.users.findOne(this.userId);
        }
    });

    Template.managementShopsEditManagers.events({
        'submit form': function(e, template){
            e.preventDefault();
            var email = $('[name="email"]', e.curreentTarget).val();
        }
    });

})();