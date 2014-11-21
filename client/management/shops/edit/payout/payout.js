(function () {

    Template.managementShopsEditPayout.events({
        'click .attachPayPalAccountBtn': function(e, template){
            var $btn = $(e.currentTarget).button('generating').prop('disabled', true);
            Meteor.call('PayPal:generateAccountRequest', this._id, Meteor.absoluteUrl('paypal/return'), Meteor.absoluteUrl('paypal/cancel'), function(err, url){
                if (!err) {
                    $btn.button('redirecting');
                    location.replace(url);
                } else {
                    $btn.button('reset').prop('disabled', false);
                }
            });
        }
    });

})();