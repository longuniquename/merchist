(function () {

    var getLoginStatus = function () {
        return new Promise(function (resolve, reject) {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    };

    var checkManagePagesPermission = function () {
        return new Promise(function (resolve, reject) {
            FB.api('/me/permissions', function (response) {
                var permission = _.find(response.data, function (permission) {
                    if (permission.permission === 'manage_pages') {
                        return true;
                    }
                });
                if (permission && permission.status === 'granted') {
                    resolve();
                }
                reject();
            });
        });
    };

    var getPages = function () {
        return new Promise(function (resolve, reject) {
            FB.api('/me/accounts', {limit: 100}, function (response) {
                resolve(_.filter(response.data, function (page) {
                    return !Shops.findOne({'platforms.facebookPages.id': page.id});
                }));
            });
        });
    };

    Template.managementShopsEditDestinationsFacebookPage.events({
        'click .attachBtn': function (e, template) {

            var $btn = $(e.currentTarget).button('loading');

            getLoginStatus()
                .catch(function () {
                    alert('not authorized');
                })
                .then(function () {
                    return checkManagePagesPermission();
                })
                .then(function () {
                    return getPages();
                })
                .then(function (pages) {
                    $btn.button('reset');

                    var view = Blaze.renderWithData(Template.attachFacebookPagesToShopDlg, {
                            pages: pages,
                            shop:  template.data
                        }, document.getElementsByTagName("body")[0]),
                        $dlg = $(view.firstNode());

                    $dlg.modal('show');
                    $dlg.on('hidden.bs.modal', function () {
                        Blaze.remove(view);
                    });
                });
        },
        'click .detachBtn': function (e, template) {
            Shops.update(template.data._id, {$pull: {'platforms.facebookPages': {id: this.id}}});
        }
    });

})();
