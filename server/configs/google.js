(function () {

    ServiceConfiguration.configurations.remove({
        service: "google"
    });
    ServiceConfiguration.configurations.insert({
        service:    "google",
        clientId:   "460683714795-g877vbbvc864h0hp0gbf7d06b5ftujb3.apps.googleusercontent.com",
        loginStyle: "popup",
        secret:     "7e1voWE4cHL6PHicSuUvzIgu"
    });

})();