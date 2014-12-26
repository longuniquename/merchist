(function(){

    Template.productsListPartial.helpers({
        seller:   function () {
            Meteor.subscribe("user", this.userId);
            return Meteor.users.findOne(this.userId);
        }
    });

})();
