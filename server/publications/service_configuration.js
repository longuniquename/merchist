Meteor.publish('serviceConfiguration', function (service) {
    return ServiceConfiguration.configurations.find({service: service});
});
