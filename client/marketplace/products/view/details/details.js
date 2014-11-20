(function(){

    Template.marketplaceProductsViewDetails.helpers({
        'currency': function(price){
            return '$' + Number(price).toFixed(2);
        }
    });

    Template.marketplaceProductsViewDetails.events({
        'click .buyBtn': function(e, template){

            Session.set('cart', (Session.get('cart') || 0) + 1);

            console.log(Session.get('cart'));
        }
    });

})(Template);