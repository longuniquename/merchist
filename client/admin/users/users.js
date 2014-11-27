(function(){

    Template.adminUsers.events({
        'click .removeBtn': function(e, template){
            e.preventDefault();
            Meteor.users.remove(this._id);
        }
    });

})();
