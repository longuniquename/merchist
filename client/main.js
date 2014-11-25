(function(){

    Meteor.subscribe("shops");

    var cartId = localStorage["cartId"];

    if (!cartId) {
        cartId = localStorage["cartId"] = Meteor.uuid();
    }

    Meteor.subscribe("myCart", cartId);

    var getUserLanguage = function () {
        var userLanguage = _.find(navigator.languages, function(userLanguage){
            return _.has(TAPi18n.getLanguages(), userLanguage);
        });
        if (!userLanguage) {
            userLanguage = 'en';
        }
        return userLanguage;
    };

    Meteor.startup(function () {
        TAPi18n.setLanguage(getUserLanguage());
    });

    Template.registerHelper('currency', function(price){
        return '$' + Number(price).toFixed(2);
    });

})();
