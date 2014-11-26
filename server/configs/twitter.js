(function () {

    ServiceConfiguration.configurations.remove({
        service: "twitter"
    });
    ServiceConfiguration.configurations.insert({
        service:     "twitter",
        consumerKey: "YVRd4eQwAnndlpvmi27C7RPpD",
        loginStyle:  "popup",
        secret:      "HxlvH1w1YtTNgUSrNgEw5fc7egkQ7tESWL7QcmLP5t8VQqijtT"
    });

})();
