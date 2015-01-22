FbApi.getLoginStatus = function (force) {
    return new Promise(function (resovle) {
        FB.getLoginStatus(function (response) {
            resovle(response);
        }, !!force);
    });
};

FbApi.checkPermissions = function (permissions) {
    return new Promise(function (resovle, reject) {
        FB.api('me/permissions', function (response) {

            var prevPerms = _.reduce(response.data, function (memo, item) {
                memo[item.permission] = item.status;
                return memo;
            }, {});

            resovle(_.reduce(permissions, function (memo, permission) {
                memo[permission] = _.has(prevPerms, permission) ? prevPerms[permission] : 'missing';
                return memo;
            }, {}));

        });
    });
};

FbApi.whitelistedPermissions = [
    'public_profile',
    'user_friends',
    'email',
    'user_groups',
    'manage_pages',
    'publish_actions'
];

function PermissionsMissingError(permissions) {
    this.name = 'PermissionsMissingError';
    this.message = 'Permissions missing';
    this.permissions = permissions;
    this.stack = (new Error()).stack;
}
PermissionsMissingError.prototype = new Error;

FbApi.ensurePermissions = function (permissions) {
    return FbApi.getLoginStatus(true)
        //checking if user is logged in
        .then(function (response) {
            if (response.status === 'connected') {
                if (
                    !Meteor.user() ||
                    !Meteor.user().services ||
                    !Meteor.user().services.facebook ||
                    !Meteor.user().services.facebook.id ||
                    Meteor.user().services.facebook.id !== response.authResponse.userID
                ) {
                    throw new Meteor.Error('logged-out', 'User is not logged in');
                }
                return FbApi.checkPermissions(['publish_actions'])
            } else {
                throw new Meteor.Error('logged-out', 'User is not logged in');
            }
        })
        //checking if we have enough permissions
        .then(function (permissions) {
            if (_.intersection(_.values(permissions), ['missing', 'declined']).length) {
                throw new PermissionsMissingError(_.reduce(permissions, function (memo, status, permission) {
                    if (status === 'missing' || status === 'declined') {
                        memo.push(permission);
                    }
                    return memo;
                }, []));
            }
        })
        //request new permissions if they are missing
        .catch(PermissionsMissingError, function (err) {
            return new Promise(function (resovle, reject) {
                var view = Blaze.renderWithData(Template.fbPermissionsRequestDlg, {permissions: err.permissions}, document.getElementsByTagName("body")[0]),
                    $dlg = $(view.firstNode());
                $dlg.modal('show');
                $dlg.on('hidden.bs.modal', function () {
                    Blaze.remove(view);
                    FbApi.checkPermissions(err.permissions)
                        .then(function (permissions) {
                            if (_.intersection(_.values(permissions), ['missing', 'declined']).length) {
                                reject(new Meteor.Error('permission-request-refused', 'User has refused a permission request'));
                            } else {
                                resovle();
                            }
                        });
                });
            });
        });
};

FbApi.api = function (method, path, params) {
    return new Promise(function (resovle, reject) {
        FB.api(path, method, params, function (response) {
            resovle(response);
        });
    });
};

FbApi.api.get = function (path, params) {
    return FbApi.api('GET', path, params);
};

FbApi.api.post = function (path, params) {
    return FbApi.api('POST', path, params);
};

FbApi.api.del = function (path, params) {
    return FbApi.api('DELETE', path, params);
};

FbApi.login = function (permissions) {
    return new Promise(function (resolve, reject) {
        FB.login(function (response) {
            resolve(response);
        }, {
            scope:         permissions.join(','),
            return_scopes: true
        });
    });
};
