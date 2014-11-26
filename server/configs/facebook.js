(function () {

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service:    "facebook",
        appId:      "301234113401207",
        loginStyle: "popup",
        secret:     "992c0edf51ed0ba7b6b0b057c76e255b"
    });

})();
