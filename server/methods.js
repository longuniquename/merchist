Meteor.methods({
    sendVerificationEmail: function (email) {
        return Accounts.sendVerificationEmail(this.userId, email);
    }
});