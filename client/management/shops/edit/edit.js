Template.shopEdit.events({
    'submit .shopEditForm': function (e) {
        e.preventDefault();

        var data = {
            'title': $('input[name="title"]', e.currentTarget).val()
        };

        if (!this.shop._id) {
            var shopId = Shops.insert(data);
            Router.go('management.shops.edit', {shopId: shopId});
        } else {
            Shops.update(this.shop._id, {$set: data});
        }
    }
});