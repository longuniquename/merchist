(function(){

    Template.productCardPartial.helpers({
        image:   function () {
            if (this.imageIds && this.imageIds.length) {
                Meteor.subscribe("image", this.imageIds[0]);
                return Images.findOne(this.imageIds[0]);
            }
        },
        isMy: function(){
            return this.userId === Meteor.userId();
        }
    });

})();
