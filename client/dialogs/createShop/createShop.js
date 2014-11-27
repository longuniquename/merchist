(function () {

    Template.createShopDlg.events({
        'submit form':        function (e, template) {
            e.preventDefault();
            var $dlg = $(template.firstNode);

            var title = template.$('[name="title"]').val();

            Router.go(
                'shops.edit',
                {
                    _id: Shops.insert({
                        title: title,
                        managers: [
                            {
                                userId: Meteor.userId(),
                                role:   'owner'
                            }
                        ]
                    })
                }
            );

            $dlg.modal('hide');
        }
    });

})();