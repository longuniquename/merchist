Meteor.subscribe("shops");

var cartId = localStorage["cartId"];

if (!cartId) {
    cartId = localStorage["cartId"] = Meteor.uuid();
}

Meteor.subscribe("myCart", cartId);
