(function(){

    Template.managementShopsEditTracking.events({
        'change [name="googleAnalyticsId"]': function(e, template){
            Shops.update(this._id, {$set: {'tracking.googleAnalyticsId': template.$(e.currentTarget).val()}});
        }
    });

})();