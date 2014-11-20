(function(){

    Template.profileDetailsEmails.events({
        'click .verifyBtn': function(e, template){
            if (!this.verified) {
                Accounts.sendVerificationEmail(Meteor.userId(), this.address);
            }
        }
    });

})();