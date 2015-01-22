(function () {

    function Permissions(permissions) {
        this._defs = permissions;
        this._permissions = _.keys(permissions);
        this._dep = new Tracker.Dependency;
    }

    Permissions.prototype.get = function () {
        this._dep.depend();
        return this._permissions;
    };

    Permissions.prototype.getDefs = function () {
        this._dep.depend();
        return _.pick(this._defs, this._permissions);
    };

    Permissions.prototype.set = function (permissions) {
        if (EJSON.equals(this._permissions, permissions))
            return;

        this._permissions = permissions;
        this._dep.changed();
    };

    Template.fbPermissionsRequestDlg.created = function () {
        this.data.permissions = new Permissions(this.data.permissions);
    };

    Template.fbPermissionsRequestDlg.helpers({
        permissions: function () {
            return _.map(this.permissions.getDefs(), function (description, permissionKey) {
                var permission = permissionKey;
                switch (permissionKey) {
                    case 'publish_actions':
                        permission = 'Publish actions';
                        break;
                }
                return {
                    permission:  permission,
                    description: description
                }
            });
        }
    });

    Template.fbPermissionsRequestDlg.events({
        'click .grantBtn': function (e, template) {
            var $dlg = $(template.firstNode);
            FbApi.login(template.data.permissions.get())
                .then(function () {
                    return FbApi.checkPermissions(template.data.permissions.get());
                })
                .then(function (permissionsStatus) {

                    template.data.permissions.set(_.reduce(permissionsStatus, function (memo, status, permission) {
                        if (status === 'missing' || status === 'declined') {
                            memo.push(permission);
                        }
                        return memo;
                    }, []));

                    if (!template.data.permissions.get().length) {
                        $dlg.modal('hide');
                    }

                });
        }
    });

})();
