Order.prototype.pay = function (callback) {
    var self = this;
    Meteor.call('Orders:getPayUrl', this._id, function (err, url) {
        if (!err) {
            var embeddedPPFlow = new PAYPAL.apps.DGFlow({expType: 'light'});
            embeddedPPFlow.startFlow(url);
            var handle = Orders.find({_id: self._id}).observeChanges({
                changed: function (id, fields) {
                    if (fields && fields.status && fields.status === "COMPLETED") {
                        handle.stop();
                        if (embeddedPPFlow.isOpen()) {
                            embeddedPPFlow.closeFlow();
                        }
                    }
                }
            });

            $('iframe[name="PPDGFrame"]').on('load', function () {
                try {
                    var flowLocation = this.contentWindow.location.href;
                } catch (e) {
                }
                if (flowLocation === Meteor.absoluteUrl('_orders/pay/close')) {
                    handle.stop();
                    if (embeddedPPFlow.isOpen()) {
                        embeddedPPFlow.closeFlow();
                    }
                }
            });
        }
    });
};
