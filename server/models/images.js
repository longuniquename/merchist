Meteor.publish('images', function () {
    return Images.find();
});

Meteor.publish('image', function (imageId) {
    return Images.find({ _id: imageId });
});