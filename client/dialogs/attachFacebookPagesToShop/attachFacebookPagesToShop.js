(function () {

    Template.attachFacebookPagesToShopDlg.rendered = function(){
        console.log(this.data);
    };

    Template.attachFacebookPagesToShopDlg.helpers({
        'attached': function(){
            var shopId = Template.instance().data.shop._id;
            return !! Shops.findOne({_id: shopId, 'platforms.facebookPages.id': this.id});
        }
    });

    Template.attachFacebookPagesToShopDlg.events({
        'click .attachBtn': function(e, template){
            Shops.update(template.data.shop._id, {$push: {'platforms.facebookPages': this}});
        },
        'click .detachBtn': function(e, template){
            Shops.update(template.data.shop._id, {$pull: {'platforms.facebookPages': {id: this.id}}});
        }
    });

})();
