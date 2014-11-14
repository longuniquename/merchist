(function(){

    Template.managementShopsEditGeneral.events({
        'submit form': function(e, template){
            e.preventDefault();

            var data = {};
            data['title'] = template.$('[name="title"]', e.currentTarget).val();
            data['subtitle'] = template.$('[name="subtitle"]', e.currentTarget).val();
            data['description'] = template.$('[name="description"]', e.currentTarget).val();
            data['payments.tax'] = template.$('[name="tax"]', e.currentTarget).val();

            if (!this._id) {
                Router.go('shops.edit', {_id: Shops.insert(data)});
            } else {
                Shops.update(this._id, {$set: data});
            }
        }
    });

})();