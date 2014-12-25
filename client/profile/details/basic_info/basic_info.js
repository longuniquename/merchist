(function () {

    Template.profileDetailsBasicInfo.helpers({
        collection: function () {
            return Meteor.users;
        }
    });

})();
