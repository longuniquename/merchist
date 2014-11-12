Template.shopEdit.helpers({
    shop: function() {
        if (this.shopId) {
            return Shops.findOne(this.shopId);
        } else {
            return {};
        }
    }
});

Template.shopEdit.events({
    'submit .shopEditForm': function (e) {
        e.preventDefault();

        var data = {
            title: $('input[name="title"]', e.currentTarget).val(),
            subtitle: $('input[name="subtitle"]', e.currentTarget).val(),
            description: $('textarea[name="description"]', e.currentTarget).val()
        };

        if (!this._id) {
            Router.go('shops.edit', {shopId: Shops.insert(data)});
        } else {
            Shops.update(this._id, {$set: data});
        }
    },
    'change #shopLogo': function (e) {
        var logoFile = e.currentTarget.files[0],
            logoReader = new FileReader();
        logoReader.onload = function (e) {
            $('#shopLogoPreview').attr('src', e.target.result);
        };
        logoReader.readAsDataURL(logoFile);
    }
});