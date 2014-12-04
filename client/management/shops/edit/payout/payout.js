(function () {

    Template.managementShopsEditPayPal.events({
        'click .attachPayPalAccountBtn': function(e, template){
            var $btn = $(e.currentTarget).button('generating').prop('disabled', true);
            Meteor.call('PayPal:generateAccountRequest', this._id, Meteor.absoluteUrl('paypal/return'), Meteor.absoluteUrl('paypal/cancel'), function(err, url){
                if (!err) {
                    $btn.button('redirecting');
                    if (Meteor.isCordova) {
                        var ref = window.open(url, '_blank', 'location=yes');
                        ref.addEventListener('exit', function(){
                            $btn.button('reset').prop('disabled', false);
                        });
                    } else {
                        location.replace(url);
                    }
                } else {
                    $btn.button('reset').prop('disabled', false);
                }
            });
        }
    });

})();