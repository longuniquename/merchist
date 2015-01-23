(function () {

    Template.sellView.rendered = function () {
        $.material.togglebutton();
        Session.setDefault('shareSalesOnFacebook', false);
    };

    Template.sellView.helpers({
        shareSalesOnFacebook: function () {
            return Session.get("shareSalesOnFacebook");
        }
    });

    Template.sellView.events({
        'change input[name="shareOnFacebook"]': function (e, template) {
            Session.set('shareSalesOnFacebook', template.$('input[name="shareOnFacebook"]').is(':checked'));

            if (Session.get('shareSalesOnFacebook')) {
                FbApi.ensurePermissions({
                    'publish_actions': 'Merchist needs it to post a story to your Facebook Timeline'
                })
                    .then(function () {
                        Session.set('shareSalesOnFacebook', true);
                    })
                    .catch(function (err) {
                        console.error(err);
                        Session.set('shareSalesOnFacebook', false);
                    });
            }
        }
    });

    AutoForm.hooks({
        sellForm: {
            before:    {
                insert: function (doc, template) {
                    doc.userId = Meteor.userId();
                    return doc;
                }
            },
            onSuccess: function (operation, productId, template) {
                if (Session.get("shareSalesOnFacebook")) {

                    FbApi.ensurePermissions({
                        'publish_actions': 'Merchist needs it to post a story to your Facebook Timeline'
                    }).then(function () {
                        Meteor.call('FbApi:action:sell', productId, function (err, result) {
                            console.log(err, result);
                        })
                    });

                }

                Router.go('product', {_id: productId});
            }
        }
    });

})();
