(function () {

    Template.mcInputImages.created = function(){
        this.data.imageIds = [];
        this.data.imageIdsDep = new Tracker.Dependency;
    };

    Template.mcInputImages.helpers({
        images: function () {
            Template.instance().data.imageIdsDep.depend();
            return Images.find({_id: {$in: Template.instance().data.imageIds}});
        }
    });

    Template.mcInputImages.events({
        'click .uploadBtn':                     function (e, template) {
            var $fileInput = template.$('.uploadBtn input[type="file"]');

            if (!$fileInput.length) {
                $fileInput = $('<input />');
                $fileInput.attr({
                    type: 'file',
                    accept: 'image/*'
                });
                $fileInput.prop({
                    multiple: true
                });
                $fileInput.css({
                    opacity:  0,
                    display:  'block',
                    height:   0,
                    width:    0,
                    position: 'absolute',
                    top:      -9999,
                    left:     -9999
                });
                $fileInput.appendTo(template.$('.uploadBtn'));
            }

            if (e.target !== $fileInput[0]) {
                e.preventDefault();
                $fileInput.click();
            }
        },
        'change .uploadBtn input[type="file"]': function (e, template) {
            e.preventDefault();
            var $fileInput = template.$('.uploadBtn input[type="file"]');
            $fileInput.remove();

            FS.Utility.eachFile(e, function(file) {
                var newFile = new FS.File(file);
                newFile.userId = Meteor.userId();
                Images.insert(newFile, function (err, fileObj) {
                    if (!err) {
                        template.data.imageIds.push(fileObj._id);
                        template.data.imageIdsDep.changed();
                        console.log(fileObj);
                    }
                });
            });
        }
    });

})();
