FbApi.getLoginStatus = function () {
    return new Promise(function (resovle, reject) {
        facebookConnectPlugin.getLoginStatus(
            function (response) {
                resovle(response);
            },
            function (error) {
                reject(error);
            }
        );
    });
};
