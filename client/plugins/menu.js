+function ($) {
    'use strict';

    // MENU CLASS DEFINITION
    // ======================

    var Menu = function (element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$backdrop =
            this.isShown = null;
        this.scrollbarWidth = 0;

        if (this.options.remote) {
            this.$element
                .find('.menu-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.mc.menu')
                }, this))
        }
    };

    Menu.VERSION = '0.0.1';

    Menu.TRANSITION_DURATION = 300;
    Menu.BACKDROP_TRANSITION_DURATION = 150;

    Menu.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show:     true
    };

    Menu.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    };

    Menu.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.mc.menu', {relatedTarget: _relatedTarget});

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass('menu-open');

        this.escape();
        this.resize();

        this.$element.on('click.dismiss.mc.menu', '[data-dismiss="menu"]', $.proxy(this.hide, this));

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade');

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body); // don't move menus dom position
            }

            that.$element
                .show()
                .scrollTop(0);

            if (that.options.backdrop) that.adjustBackdrop();
            that.adjustDialog();

            if (transition) {
                that.$element[0].offsetWidth; // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false);

            that.enforceFocus();

            var e = $.Event('shown.mc.menu', {relatedTarget: _relatedTarget});

            transition ?
                that.$element.find('.menu-dialog') // wait for menu to slide in
                    .one('mcTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(Menu.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    };

    Menu.prototype.hide = function (e) {
        if (e) e.preventDefault();

        e = $.Event('hide.mc.menu');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        this.escape();
        this.resize();

        $(document).off('focusin.mc.menu');

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.mc.menu');

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('mcTransitionEnd', $.proxy(this.hideMenu, this))
                .emulateTransitionEnd(Menu.TRANSITION_DURATION) :
            this.hideMenu()
    };

    Menu.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.mc.menu') // guard against infinite focus loop
            .on('focusin.mc.menu', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    };

    Menu.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.mc.menu', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.mc.menu')
        }
    };

    Menu.prototype.resize = function () {
        if (this.isShown) {
            $(window).on('resize.mc.menu', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.mc.menu')
        }
    };

    Menu.prototype.hideMenu = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.$body.removeClass('menu-open');
            that.resetAdjustments();
            that.resetScrollbar();
            that.$element.trigger('hidden.mc.menu')
        })
    };

    Menu.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    };

    Menu.prototype.backdrop = function (callback) {
        var that = this;
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="menu-backdrop ' + animate + '" />')
                .prependTo(this.$element)
                .on('click.dismiss.mc.menu', $.proxy(function (e) {
                    if (e.target !== e.currentTarget) return;
                    this.options.backdrop == 'static'
                        ? this.$element[0].focus.call(this.$element[0])
                        : this.hide.call(this)
                }, this));

            if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

            this.$backdrop.addClass('in');

            if (!callback) return;

            doAnimate ?
                this.$backdrop
                    .one('mcTransitionEnd', callback)
                    .emulateTransitionEnd(Menu.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');

            var callbackRemove = function () {
                that.removeBackdrop();
                callback && callback()
            };
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('mcTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Menu.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    };

    // these following methods are used to handle overflowing menus

    Menu.prototype.handleUpdate = function () {
        if (this.options.backdrop) this.adjustBackdrop();
        this.adjustDialog()
    };

    Menu.prototype.adjustBackdrop = function () {
        this.$backdrop
            .css('height', 0)
            .css('height', this.$element[0].scrollHeight)
    };

    Menu.prototype.adjustDialog = function () {
        var menuIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

        this.$element.css({
            paddingLeft:  !this.bodyIsOverflowing && menuIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !menuIsOverflowing ? this.scrollbarWidth : ''
        })
    };

    Menu.prototype.resetAdjustments = function () {
        this.$element.css({
            paddingLeft:  '',
            paddingRight: ''
        })
    };

    Menu.prototype.checkScrollbar = function () {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight;
        this.scrollbarWidth = this.measureScrollbar()
    };

    Menu.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    };

    Menu.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', '')
    };

    Menu.prototype.measureScrollbar = function () { // thx walsh
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'menu-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth
    };


    // MENU PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('mc.menu');
            var options = $.extend({}, Menu.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('mc.menu', (data = new Menu(this, options)));
            if (typeof option == 'string') data[option](_relatedTarget);
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.menu;

    $.fn.menu = Plugin;
    $.fn.menu.Constructor = Menu;


    // MENU NO CONFLICT
    // =================

    $.fn.menu.noConflict = function () {
        $.fn.menu = old;
        return this
    };


    // MENU DATA-API
    // ==============

    $(document).on('click.mc.menu.data-api', '[data-toggle="menu"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
        var option = $target.data('mc.menu') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show.mc.menu', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return; // only register focus restorer if menu will actually get shown
            $target.one('hidden.mc.menu', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        });
        Plugin.call($target, option, this)
    })

}(jQuery);
