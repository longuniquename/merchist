(function () {

    var getLoginStatus = function () {
        return new Promise(function (resolve, reject) {
            if (Meteor.isCordova) {
                facebookConnectPlugin.getLoginStatus(
                    function (response) {
                        resolve(response);
                    },
                    function (err) {
                        reject(err);
                    }
                );
            } else {
                FB.getLoginStatus(function (response) {
                    resolve(response);
                });
            }
        });
    };

    var login = function () {
        return new Promise(function (resolve, reject) {
            if (Meteor.isCordova) {
                facebookConnectPlugin.login(
                    ['public_profile', 'email'],
                    function (response) {
                        resolve(response);
                    },
                    function (err) {
                        reject(err);
                    }
                );
            } else {
                Facebook.requestCredential(
                    {
                        requestPermissions: ['public_profile', 'email'],
                        loginStyle:         'popup'
                    },
                    function(token){
                        resolve(token);
                    }
                );
            }
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
            if (Meteor.isCordova) {
                try {
                    facebookConnectPlugin.api(
                        'me/accounts?limit=100',
                        ['manage_pages'],
                        function (response) {
                            resolve(_.filter(response.data, function (page) {
                                return !Shops.findOne({'platforms.facebookPages.id': page.id});
                            }));
                        },
                        function (err) {
                            reject(new Meteor.Error("facebook-api-error", err));
                        }
                    );
                } catch (e) {
                    alert(e + JSON.stringify(e));
                    reject(new Meteor.Error("facebook-api-error", "something bad happened"));
                }
            } else {
                FB.api('/me/accounts', {limit: 100}, function (response) {
                    resolve(_.filter(response.data, function (page) {
                        return !Shops.findOne({'platforms.facebookPages.id': page.id});
                    }));
                });
            }
        });
    };

    var ensureLogin = function(){
        return getLoginStatus()
            .then(function(loginStatus){
                if (loginStatus.status !== 'connected') {
                    return login()
                        .then(function(loginStatus){
                            if (!Meteor.isCordova) {
                                return checkManagePagesPermission();
                            }
                            return loginStatus;
                        });
                }
                return loginStatus;
            });
    };

    Template.managementShopsEditDestinationsFacebookPage.events({
        'click .attachBtn': function (e, template) {

            var $btn = $(e.currentTarget).button('loading');

            ensureLogin()
                .then(function (loginStatus) {
                    return getPages(loginStatus);
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
                })
                .catch(function (e) {
                    $btn.button('reset');
                    alert(JSON.stringify(e));
                });
        },
        'click .detachBtn': function (e, template) {
            Shops.update(template.data._id, {$pull: {'platforms.facebookPages': {id: this.id}}});
        }
    });

})();
