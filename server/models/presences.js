Meteor.publish('userPresence', function() {
    var filter = {};
    return Presences.find(filter, { fields: { state: true, userId: true }});
});
