(function () {

    var shareOnFacebook = false;

    Template.sellView.rendered = function () {
        $.material.togglebutton();
        $.material.input();
    };

    Template.sellView.helpers({});

    Template.sellView.events({
        'change input[name="shareOnFacebook"]': function (e, template) {
            shareOnFacebook = template.$('input[name="shareOnFacebook"]').is(':checked');
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
                if (shareOnFacebook) {

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
                }

                Router.go('products.view', {_id: productId});
            }
        }
    });

})();
