(function () {

    Template.addEmailDlg.events({
        'submit form':        function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            var email = template.$('[name="email"]').val();

            Meteor.call('userAddEmailAddress', email, function(err, resp){
                console.log(arguments);
                $dlg.modal('hide');
            });
        }
    });

})();