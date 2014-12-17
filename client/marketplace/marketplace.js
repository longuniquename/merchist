(function () {

    Template.marketplace.helpers({
        images: function(){
            Meteor.subscribe("productImages", this._id);
            return Images.find({_id: {$in: this.imageIds}});
        }
    });

})();
