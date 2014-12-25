(function () {

    Template.marketplace.rendered = function() {
        try {
            FB.XFBML.parse();
        }catch(e) {}
    };

    Template.marketplace.helpers({
        images:   function () {
            Meteor.subscribe("productImages", this._id);
            return Images.find({_id: {$in: this.imageIds}});
        },
        image:   function () {
            if (this.imageIds && this.imageIds.length) {
                Meteor.subscribe("image", this.imageIds[0]);
                return Images.findOne(this.imageIds[0]);
            }
        },
        seller:   function () {
            Meteor.subscribe("user", this.userId);
            return Meteor.users.findOne(this.userId);
        },
        'avatar': function () {
            Meteor.subscribe("image", this.profile.avatarId);
            return Images.findOne(this.profile.avatarId);
        }
    });

    Template.marketplace.events({
        'click .showPhoneBtn': function (e) {
            e.preventDefault();
            window.open('tel:' + this.profile.phone, '_system');
        },
        'click .showEmailBtn': function (e) {
            e.preventDefault();
            window.open('mailto:' + this.profile.email, '_system');
        },
        'click .shareBtn': function(e){
            e.preventDefault();
            console.log(this);

            if (!Meteor.isCordova) {
                FB.ui({
                    method: 'share',
                    href: Router.url('products.view', this)
                }, function(response){});
            } else {
                facebookConnectPlugin.showDialog({
                    method: 'share',
                    href: Router.url('products.view', this)
                }, function(response){}, function(response){});
            }
        }
    });

})();
