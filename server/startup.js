var app = WebApp.connectHandlers;

Meteor.startup(function () {
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return next();
    })
});
