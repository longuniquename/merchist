(function(){

    Template.sellButton.events({
        'click #sellButton': function(e, template){
            e.preventDefault();

            var view = Blaze.render(Template.sellDlg, document.getElementsByTagName("body")[0]),
                $dlg = $(view.templateInstance().firstNode);

            $dlg.modal('show');
            $dlg.on('hidden.bs.modal', function (e) {
                Blaze.remove(view);
            })
        }
    });

})();
