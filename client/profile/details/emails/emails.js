(function(){

    Template.profileDetailsEmails.events({
        'click .verifyBtn': function(e, template){
            if (!this.verified) {
                Meteor.call('sendVerificationEmail', this.address);
            }
        }
    });

})();
