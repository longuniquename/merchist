(function(){

    Template.managementShopsEditTracking.events({
        'submit form': function(e, template){
            e.preventDefault();

            var data = {};
            data['tracking.googleAnalyticsId'] = template.$('[name="googleAnalyticsId"]', e.currentTarget).val();

            if (!this._id) {
                Router.go('shops.edit', {_id: Shops.insert(data)});
            } else {
                Shops.update(this._id, {$set: data});
            }
        }
    });

})();