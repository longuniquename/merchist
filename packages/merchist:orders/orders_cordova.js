Order.prototype.pay = function (callback) {
    var fail = function (err) {
        Meteor._debug("Error from Pay popup: " + JSON.stringify(err));
    };

    var pageLoaded = function (event) {
        if (event.url.indexOf(Meteor.absoluteUrl('_orders/pay/close')) === 0) {
            setTimeout(function () {
                popup.close();
                callback && callback();
            }, 100);
        }
    };

    var onExit = function () {
        popup.removeEventListener('loadstop', pageLoaded);
        popup.removeEventListener('loaderror', fail);
        popup.removeEventListener('exit', onExit);
    };

    var popup = window.open(Meteor.absoluteUrl('_orders/pay?orderId=' + this._id), '_blank', 'location=yes,hidden=yes');
    popup.addEventListener('loadstop', pageLoaded);
    popup.addEventListener('loaderror', fail);
    popup.addEventListener('exit', onExit);
    popup.show();
};
