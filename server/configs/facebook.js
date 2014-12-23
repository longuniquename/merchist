(function () {

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service:    "facebook",
        loginStyle: "popup",
        appId:      process.env.FACEBOOK_APP_ID        || "301234496734502",
        secret:     process.env.FACEBOOK_APP_SECRET    || "303e8d4d5c2be57b604a95a9a2b1b827",
        namespace:  process.env.FACEBOOK_APP_NAMESPACE || "merchist_local"
    });

})();
