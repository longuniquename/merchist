FbApi = {
    getLoginStatus: function () {
        throw new Meteor.Error('This method should be implemented for platform.');
    },
    api:            function (method, path, params, permissions) {
        throw new Meteor.Error('This method should be implemented for platform.');
    }
};

FbApi.AuthError = function () {
    this.error = 403;
    this.reason = 'User is not authorized';
};
FbApi.AuthError.prototype = new Meteor.Error();
FbApi.AuthError.prototype.name = 'FbApi.AuthError';

FbApi.PermsError = function () {
    this.error = 403;
    this.reason = 'Not enough permissions';
};
FbApi.PermsError.prototype = new Meteor.Error();
FbApi.PermsError.prototype.name = 'FbApi.PermsError';