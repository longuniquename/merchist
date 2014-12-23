(function () {

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service:    "facebook",
        loginStyle: "popup",
        appId:      process.env.FACEBOOK_APP_ID        || "301234113401207",
        secret:     process.env.FACEBOOK_APP_SECRET    || "992c0edf51ed0ba7b6b0b057c76e255b",
        namespace:  process.env.FACEBOOK_APP_NAMESPACE || "merchist_staging"
    });

})();
