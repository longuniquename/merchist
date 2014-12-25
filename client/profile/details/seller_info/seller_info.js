(function () {

    Template.profileDetailsSellerInfo.helpers({
        collection: function () {
            return Meteor.users;
        }
    });

})();
