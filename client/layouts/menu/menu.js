(function(){

    Template.mainMenu.helpers({
        'shops': function () {
            if (Meteor.user()) {
                Meteor.subscribe("myShops");
                return Shops.find({"managers.userId": Meteor.userId()}, {sort: {title: 1}});
            } else {
                return false;
            }
        },
        'logo': function(){
            Meteor.subscribe("image", this.logoId);
            return Images.findOne(this.logoId);
        }
    });

    Template.mainMenu.events({
        "click .overlay": function(e, template){
            template.$('#mainMenu').removeClass('visible');
        },
        "click .closeBtn": function(e, template){
            template.$('#mainMenu').removeClass('visible');
        },
        "click .logoutBtn": function(e){
            e.preventDefault();
            Meteor.logout();
        },
        'click .createShopBtn': function (e) {
            e.preventDefault();
            if (Meteor.user()) {
                Router.go(
                    'shops.edit',
                    {
                        _id: Shops.insert({
                            managers: [
                                {
                                    userId: Meteor.userId(),
                                    role:   'owner'
                                }
                            ]
                        })
                    }
                );
            } else {

            }
        }
    });

})();
