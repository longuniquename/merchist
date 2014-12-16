(function () {

    Meteor.subscribe("userData");
    Meteor.subscribe("myShops");
    Meteor.subscribe("myImages");
    Meteor.subscribe('userPresence');

    var cartId = localStorage["cartId"];

    if (!cartId) {
        cartId = localStorage["cartId"] = Meteor.uuid();
    }

    Meteor.subscribe("myCart", cartId);

    var getUserLanguage = function () {
        var userLanguage = _.find(navigator.languages, function (userLanguage) {
            return _.has(TAPi18n.getLanguages(), userLanguage);
        });
        if (!userLanguage) {
            userLanguage = 'en';
        }
        return userLanguage;
    };

    Meteor.startup(function () {
        TAPi18n.setLanguage(getUserLanguage());
    });

    Template.registerHelper('currency', function (price) {
        return '$' + Number(price).toFixed(2);
    });

    Template.registerHelper('isConnected', function () {
        return Meteor.status().connected;
    });

    Template.registerHelper('isDisconnected', function () {
        return !Meteor.status().connected;
    });

    Template.registerHelper('isConnecting', function () {
        return Meteor.status().status === 'connecting';
    });

    Template.registerHelper('isConnectionFailed', function () {
        return Meteor.status().status === 'failed';
    });

    Template.registerHelper('isConnectionWaiting', function () {
        return Meteor.status().status === 'waiting';
    });

    Template.registerHelper('isOffline', function () {
        return Meteor.status().status === 'offline';
    });

    Template.registerHelper('not', function (value) {
        return !value;
    });

    Template.registerHelper('abs', function (path) {
        if (path) {
            return Meteor.absoluteUrl(path.replace(/^\/+/, ''));
        }
        return path;
    });

    Template.registerHelper('isOnline', function () {
        if (!this._id) {
            return false;
        }
        var presence = Presences.findOne({userId: this._id});
        if (!presence) {
            return false;
        }
        return presence.state === 'online';
    });

    if (!Meteor.isCordova) {
        window.fbAsyncInit = function () {
            FB.init({
                appId:   '301234113401207',
                status:  true,
                version: 'v2.2'
            });
        };
    } else {
        facebookConnectPlugin.browserInit('301234113401207');
    }

    Blaze.Meta = new function () {

        var meta = {};

        this.registerMeta = function (data) {
            var key = Meteor.uuid();

            var elements = [];
            _.each(data, function (content, property) {
                var $meta = $('<meta/>');
                $meta.attr('property', property);
                $meta.attr('content', content);
                $meta.appendTo($('head'));
                elements.push($meta);
            });

            meta[key] = elements;
            return key;
        };

        this.unregisterMeta = function (key) {
            if (_.has(meta, key)) {
                _.each(meta[key], function ($meta) {
                    $meta.remove();
                })
            }
            delete meta[key];
        };
    };

    if (Meteor.isCordova) {
        Tracker.autorun(function () {
            if (!Meteor.user()) {
                Router.go('splash');
            }
        });
    }

})();
