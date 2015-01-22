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
                    })
                        .then(function () {
                            var actionData = {
                                product:                Router.url('products.view', {_id: productId}),
                                'fb:explicitly_shared': true,
                                expires_in:             60 * 60 * 24 * 356 * 100,
                                scrape:                 true
                            };

                            if (Meteor.isCordova) {
                                facebookConnectPlugin.getLoginStatus(function (response) {
                                    if (response.status === 'connected') {
                                        actionData.method = 'POST';

                                        var userId = response.authResponse.userID,
                                            fbUrl = userId + '/merchist_staging:sell_new?' + $.param(actionData);

                                        facebookConnectPlugin.api(fbUrl, ['publish_actions'], function (actionObject) {
                                            Products.update(productId, {$push: {'facebook.actions': actionObject.id}});
                                        });
                                    }
                                });
                            } else {
                                FB.getLoginStatus(function (response) {
                                    if (response.status === 'connected') {
                                        FB.api(
                                            '/me/merchist_staging:sell_new',
                                            'post',
                                            actionData,
                                            function (response) {
                                                if (response && !response.error) {
                                                    Products.update(productId, {$push: {'facebook.actions': response.id}});
                                                }
                                            }
                                        );
                                    }
                                });
                            }
                        });

                }

                Router.go('products.view', {_id: productId});
            }
        }
    });

})();
