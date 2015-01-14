Orders = new Meteor.Collection("orders", {
    transform: function (doc) {
        return new Order(doc);
    }
});
