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
