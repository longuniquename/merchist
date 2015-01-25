(function () {

    Template.productViewDetailsBlock.helpers({
        'paragraphs': function (text) {
            if (text) {
                return _.filter(text.split("\n"), function (paragraph) {
                    return !!paragraph.length;
                });
            }
        }
    });

})(Template);