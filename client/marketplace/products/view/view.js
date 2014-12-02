(function () {

    var namespaces = {
            og:      'http://ogp.me/ns',
            fb:      'http://ogp.me/ns/fb',
            product: 'http://ogp.me/ns/product'
        },
        metaSelector = _.map(_.keys(namespaces), function (namespace) {
            return 'meta[property^="' + namespace + ':"]';
        }).join(', '),
        $ogMeta;

    Template.marketplaceProductsView.rendered = function () {
        var $head = $('head'),
            prefixes = [];

        $ogMeta = $(metaSelector, $('body'));
        $ogMeta.appendTo($head);

        $ogMeta.each(function () {
            var namespace = $(this).attr('property').split(':')[0];
            if (_.has(namespaces, namespace)) {
                prefixes.push(namespace + ': ' + namespaces[namespace] + '#');
            }
        });

        $head.attr('prefix', _.uniq(prefixes).join(' '));
    };

    Template.marketplaceProductsView.destroyed = function () {
        $($ogMeta).remove();
        $('head').removeAttr('prefix');
    };

    Template.marketplaceProductsView.helpers({
        'image': function () {
            Meteor.subscribe("image", this.imageId);
            return Images.findOne(this.imageId);
        }
    });

})();
