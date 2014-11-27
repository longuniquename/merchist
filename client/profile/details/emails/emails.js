(function(){

    Template.profileDetailsEmails.events({
        'click .verifyBtn': function(e, template){
            e.preventDefault();
            if (!this.verified) {
                Meteor.call('sendVerificationEmail', this.address);
            }
        },
        'click .deleteBtn': function(e, template){
            e.preventDefault();
            Meteor.call('userRemoveEmailAddress', this.address);
        },
        'click .addEmailBtn': function(e, template){
            e.preventDefault();

            var view = Blaze.render(Template.addEmailDlg, document.getElementsByTagName("body")[0]),
                $dlg = $(view.templateInstance().firstNode);

            $dlg.modal('show');
            $dlg.on('hidden.bs.modal', function (e) {
                Blaze.remove(view);
            })
        }
    });

})();
