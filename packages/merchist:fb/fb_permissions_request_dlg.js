Template.fbPermissionsRequestDlg.helpers({
    permissions: function () {
        return _.map(this.permissions, function (description, permissionKey) {
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
        FbApi.login(['publish_actions', 'user_groups'])
            .then(function (response) {
                var grantedPermissions = response.authResponse.grantedScopes.split(','),
                    missingPermissions = _.difference(['publish_actions', 'user_groups'], grantedPermissions);
                console.log(grantedPermissions, missingPermissions);
                if (!missingPermissions.length) {
                    $dlg.modal('hide');
                }
            });
    }
});
