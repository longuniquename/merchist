(function () {

    ServiceConfiguration.configurations.remove({
        service: "paypal"
    });
    ServiceConfiguration.configurations.insert({
        service:    "paypal",
        appId:      process.env.PAYPAL_APPLICATION_ID       || "APP-80W284485P519543T",
        userId:     process.env.PAYPAL_SECURITY_USERID      || "dmitriy.s.les-facilitator_api1.gmail.com",
        password:   process.env.PAYPAL_SECURITY_PASSWORD    || "1391764851",
        signature:  process.env.PAYPAL_SECURITY_SIGNATURE   || "AIkghGmb0DgD6MEPZCmNq.bKujMAA8NEIHryH-LQIfmx7UZ5q1LXAa7T",
        sandbox:    true
    });

})();
