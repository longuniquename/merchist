OgMeta = {

    _dep: new Tracker.Dependency,

    _value: [],

    _namespaces: [
        'og',
        'fb',
        'product',
        'al'
    ],

    get: function () {
        this._dep.depend();
        return this._value;
    },

    set: function (value) {
        if (EJSON.equals(this._value, value))
            return;

        this._value = value;
        this._dep.changed();
    },

    add: function (property, content) {
        this._value.push({property: property, content: content});
        this._dep.changed();
    },

    clear: function (property) {
        if (!property) {
            this.set([]);
        } else {
            this.set(_.filter(this._value, function (data) {
                return !!data.property.indexOf(property);
            }));
        }
    },

    print: function () {
        var value = this.get();
        console.log(value);

        var metaQuery = 'head ' + _.map(this._namespaces, function (namespace) {
                return 'meta[property^="' + namespace + ':"]'
            }).join(', ');
        $(metaQuery).remove();

        _.each(this._value, function (data) {
            var $meta = $('<meta/>');
            $meta.attr(data);
            $meta.appendTo('head');
        });
    }
};

Tracker.autorun(function () {
    OgMeta.print();
});

if (typeof Package['iron:router'] !== 'undefined') {
    Package['iron:router'].Router.onStop(function () {
        OgMeta.clear();
    });
}
