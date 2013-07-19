(function($) {
    $.widget('kodingsykosis.panel', {
        options: {
            title: 'Untitled',
            collapsable: true,
            collapsed: false,
            collapsedHeight: 0,
            closable: false,
            refreshable: false,
            dialog: false,
            animation: true,
            effect: 'blind',
            effectOptions: {},
            removeOnClose: true,
            duration: 700,
            position: undefined,
            url: undefined,
            draggable: undefined,
            resizable: undefined
        },

        _create: function() {
            var showHeader =
                this.options['title'] ||
                    this.options['collapsable'] ||
                    this.options['closable'] ||
                    this.options['refreshable'];

            $.extend(this, {
                header: $('.ui-panel-header', this.element),
                content: $('.ui-panel-content', this.element),
                panel: this.element
            });

            this.options['collapsed'] =
                this.options['collapsed']
                    || this.panel.is('.ui-panel-collapsed');

            if (this.content.length === 0) {
                this.content = this.element;
                this.panel = $();
            }

            if (this.panel.length === 0) {
                this.panel = $('<div>', {
                    'class': 'ui-panel'
                });

                this.content
                    .wrap(this.panel);

                this.panel =
                    this.content.parent();
            }

            if (this.header.length === 0 && showHeader !== false) {
                this.header = $('<div>', {
                    'class': 'ui-panel-header ui-accordin-header',
                    'html': this.options['title'] || 'Untitled'
                });

                this.panel
                    .prepend(this.header);
            }


            if (this.options['url']) {
                this.load(this.options['url']);
            }

            if (this.options['collapsed']) {
                this.content
                    .hide();

                this.header
                    .addClass('ui-corner-all');
            }

            this.header
                .addClass('ui-widget-header ui-corner-top')
                .disableSelection();

            this.content
                .addClass('ui-panel-content ui-widget-content ui-corner-bottom');

            this.panel
                .addClass('ui-corner-all');

            if (this.options['draggable']) {
                this.header
                    .addClass('ui-draggable');

                this.panel
                    .draggable(
                        $.extend({
                            handle: '.ui-draggable'
                        }, this.options['draggable']));
            }

            if (this.options['resizable']) {
                this.panel
                    .resizable(this.options['resizable']);
            }

            if (this.options['closable']) {
                if (typeof this.options['closable'] === 'string') {
                    this.header
                        .find(this.options['closable'])
                        .click($.proxy(this._onCloseClicked, this));
                } else {
                    this.header
                        .append(
                            $('<span>', {
                                'class': 'ui-icon ui-icon-close',
                                'click': $.proxy(this._onCloseClicked, this)
                            })
                        );
                }
            }

            if (this.options['collapsable']) {
                if (typeof this.options['collapsable'] === 'string') {
                    this.header
                        .find(this.options['collapsable'])
                        .click($.proxy(this._onCollapseClicked, this));
                } else {
                    this.header
                        .append(
                            $('<span>', {
                                'class': 'ui-icon ui-icon-minus',
                                'click': $.proxy(this._onCollapseClicked, this)
                            })
                        );
                }
            }

            if (this.options['refreshable']) {
                if (typeof this.options['refreshable'] === 'string') {
                    this.header
                        .find(this.options['refreshable'])
                        .click($.proxy(this._onRefreshClicked, this));
                } else {
                    this.header
                        .append(
                            $('<span>', {
                                'class': 'ui-icon ui-icon-refresh',
                                'click': $.proxy(this._onRefreshClicked, this)
                            })
                        );
                }
            }
        },

        _init: function() {
            var collapsed = !this.content.is(':visible') || this.panel.is('.ui-panel-collapsed');
            if (typeof this.options['collapsable'] === 'string' && this.options['collapsable'].indexOf(',')) {
                var parts = this.options['collapsable'].split(',');
                this.header
                    .find(parts[0])
                    .toggle(!collapsed);

                this.header
                    .find(parts[1])
                    .toggle(collapsed);
            }

            if (collapsed && this.options['collapsedHeight'] !== 0) {
                this.content
                    .css('height', this.options['collapsedHeight']);

                this.panel
                    .removeClass('ui-panel-collapsed');

                this.header
                    .removeClass('ui-corner-all');
            }

            if (this.options['dialog']) {
                this.panel
                    .appendTo($('body'))
                    .css({
                        position: 'absolute',
                        zIndex: 1002
                    })
                    .addClass('ui-panel-dialog')
                    .show()
                    .position({
                        my: 'center',
                        at: this.options['position'] || 'center',
                        of: 'body'
                    });


                if (this.options['modal']) {
                    this.overlay =
                        $('<div>', {
                            'class': 'ui-widget-overlay',
                            css: { zIndex: 1001 }
                        }).insertAfter(this.panel);
                }
            }
        },

        load: function(url) {
            this.content
                .load(url);
        },

        close: function () {
            var removeMe = this.options['removeOnClose'] !== false;
            
            if (this.options['dialog'] === true || this.options['animation'] === false) {
                this.panel
                    .hide();

                this.panel
                    .trigger('close');
                
                if (removeMe) {
                    this.panel
                        .remove();
                }
            } else {
                var panel = this.panel;
                var duration = this.options['duration'];
                var wrapper = $('<div>');

                wrapper.css({
                    height: this.panel.outerHeight()
                        + parseFloat(this.panel.css('margin-top'))
                        + parseFloat(this.panel.css('margin-bottom')),
                    width: this.panel.outerWidth()
                        + parseFloat(this.panel.css('margin-left'))
                        + parseFloat(this.panel.css('margin-right'))
                });

                this.panel
                    .width(this.panel.outerWidth())
                    .wrap(wrapper);
                
                panel.parent()
                    .hide(this.options['effect'],
                        this.options['effectOptions'],
                        duration,
                        function () {
                            panel.unwrap()
                                 .trigger('close');
                            
                            if (removeMe) {
                                panel.remove();
                            }
                        }
                    );
            }

            if (this.overlay) {
                this.overlay
                    .hide();
            }
        },

        expand: function() {
            this.toggle(false);
        },

        collapse: function() {
            this.toggle(true);
        },

        toggle: function(collapse, callback) {
            var icon = $(this.options['collapsable'] || '.ui-icon-minus');
            var resizable = this.options['resizable'];
            
            var header = this.header;
            var panel = this.panel;
            var content = this.content;
            
            var collapsedHeight = this.options['collapsedHeight'];

            if (typeof callback !== 'function') {
                callback = $.noop;
            }

            if (typeof collapse === 'undefined') {
                collapse = !this.isCollapsed();
            }

            panel.triggerHandler(collapse ? 'collapsing' : 'expanding');
            icon.toggleClass('ui-icon-minus', !collapse);
            icon.toggleClass('ui-icon-extlink', collapse);

            if (!collapse) {
                header.toggleClass('ui-corner-all', collapse);
                panel.toggleClass('ui-panel-collapsed', collapse);
            }

            if (typeof this.options['collapsable'] === 'string') {
                this.header
                    .find(this.options['collapsable'])
                    .toggle();
            }

            var self = this;
            self.isLoading(true);

            this.content
                .stop(true, true)
                .show(0, function() {
                    if (collapse && (!self.originalHeight || collapsedHeight === 0)) {
                        self.originalHeight = panel.height();
                    } else if (!collapse && !self.originalHeight) {
                        self.originalHeight = header.outerHeight()
                            + content.children().totalHeight(true)
                            + parseFloat(panel.css('margin-top'))
                            + parseFloat(panel.css('margin-bottom'));
                    }

                    $.debug('debug', 'OriginalHeight', self.originalHeight);
                })
                .animate({
                        height: collapse ? collapsedHeight : (this.originalHeight - header.outerHeight())
                    }, {
                        step: function(now) {
                            panel.height(now + header.outerHeight());
                            panel.triggerHandler('resize');
                        },
                        complete: function() {
                            if (collapsedHeight === 0) {
                                header.toggleClass('ui-corner-all', collapse);
                                panel.toggleClass('ui-panel-collapsed', collapse);
                            }

                            if (collapse) {
                                if (resizable) {
                                    panel.resizable('destroy');
                                }

                                if (collapsedHeight === 0) {
                                    content.hide();
                                }
                            } else {
                                if (resizable) {
                                    panel.resizable(resizable);
                                }

                                content.css({
                                    height: 'auto',
                                    bottom: '0'
                                });

                                panel.css('height', 'auto');
                            }

                            panel.triggerHandler('resize');
                            panel.triggerHandler(collapse ? 'collapse' : 'expand');
                            self.isLoading(false);
                            callback.call(this.element);
                        }
                    });
        },

        height: function(height) {
            if (typeof height === 'number' || typeof height === 'string') {
                this.panel
                    .css({
                        height: parseFloat(height)
                    });

                this.content
                    .css({
                        height: parseFloat(height) - this.header.outerHeight()
                    });
            } else if (typeof height === 'undefined') {
                var orgHeight = this.content.outerHeight();
                height = this.header.outerHeight();
                height +=
                    this.content
                        .css('height', 'auto')
                        .outerHeight();

                this.content
                    .height(orgHeight);

                return height;
            }
        },
        
        isLoading: function (loading) {
            if (typeof loading !== 'undefined') {
                this.panel.toggleClass('ui-loading', loading);
            }

            return this.panel.is('.ui-loading');
        },
        
        isCollapsed: function () {
            var content = this.element.find('.ui-panel-content');
            var collapsedHeight = this.options['collapsedHeight'];
            var currentHeight = content.outerHeight();

            return !((currentHeight !== collapsedHeight && collapsedHeight !== 0)
                || (content.is(':visible') && collapsedHeight === 0));
        },

        _onCloseClicked: function(event) {
            event.preventDefault();
            this.close();
        },

        _onCollapseClicked: function(event) {
            event.preventDefault();
            this.toggle();
        },

        _onRefreshClicked: function(event) {
            event.preventDefault();
        }
    });
})(jQuery);