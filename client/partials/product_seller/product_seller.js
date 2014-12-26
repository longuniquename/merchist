(function(){

    Template.productSellerPartial.helpers({
        'avatar': function () {
            Meteor.subscribe("image", this.profile.avatarId);
            return Images.findOne(this.profile.avatarId);
        }
    });

})();
