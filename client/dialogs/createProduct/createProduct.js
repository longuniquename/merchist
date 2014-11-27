(function () {

    Template.createProductDlg.events({
        'submit form': function (e, template) {
            console.log(template.data);
            e.preventDefault();
            var $dlg = $(template.firstNode);

            var title = template.$('[name="title"]').val();

            Router.go(
                'products.edit',
                {
                    _id: Products.insert(
                        {
                            title:  title,
                            shopId: template.data._id
                        }
                    )
                }
            );

            $dlg.modal('hide');
        }
    });

})();
