(function ($) {
    $.widget('kodingsykosis.panel', {
        options: {
            title: 'Untitled',
            collapsable: true,
            collapsed: false,
            closable: false,
            refreshable: true,
            url: undefined,
            draggable: undefined,
            resizable: undefined
        },

        _create: function () {
            var showHeader =
                this.options['title'] ||
                    this.options['collapsable'] ||
                    this.options['closable'] ||
                    this.options['refreshable'];

            $.extend(this, {
                header: $('.ui-panel-header', this.element),
                content: $('.ui-panel-content', this.element),
                panel: $('.ui-panel', this.element)
            });

            if (this.content.length == 0) {
                this.content = this.element;
            }

            if (this.panel.length == 0) {
                this.panel = $('<div>', {
                    'class': 'ui-panel'
                });

                this.content
                    .wrap(this.panel);

                this.panel =
                    this.content.parent();
            }

            if (this.header.length == 0 && showHeader !== false) {
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
            }

            this.header
                .addClass('ui-widget-header ui-corner-top');

            this.content
                .addClass('ui-panel-content ui-widget-content ui-corner-bottom');

            if (this.options['draggable']) {
                this.panel
                    .draggable(this.options['draggable']);
            }

            if (this.options['resizable']) {
                this.panel
                    .resizable(this.options['resizable']);
            }

            if (this.options['closable']) {
                this.header
                    .append(
                        $('<span>', {
                            'class': 'ui-icon ui-icon-close',
                            'click': $.proxy(this._onCloseClicked, this)
                        })
                    );
            }

            if (this.options['collapsable']) {
                this.header
                    .append(
                        $('<span>', {
                            'class': 'ui-icon ui-icon-minus',
                            'click': $.proxy(this._onCollapseClicked, this)
                        })
                    );
            }

            if (this.options['refreshable']) {
                this.header
                    .append(
                        $('<span>', {
                            'class': 'ui-icon ui-icon-refresh',
                            'click': $.proxy(this._onRefreshClicked, this)
                        })
                    );
            }
        },

        load: function (url) {
            this.content
                .load(url);
        },

        _onCloseClicked: function () {

        },

        _onCollapseClicked: function (event) {
            var collapse = this.content.is(':visible');
            var icon = $(event.delegateTarget || event.target);
            var header = this.header;
            var panel = this.panel;
            var resizable = this.options['resizable'];
            var content = this.content;

            icon.toggleClass('ui-icon-minus', !collapse);
            icon.toggleClass('ui-icon-extlink', collapse);
            header.toggleClass('ui-corner-all', collapse);
            
            if (collapse) {
                this.originalHeight = this.content.height();
            }

            this.content
                .show()
                .animate({
                        height: collapse ? 0 : this.originalHeight
                    }, {
                    step: function (now, tween) {
                        panel.height(now + header.outerHeight());
                    },
                    complete: function () {
                        header.toggleClass('ui-corner-all', collapse);
                        if (!resizable) return;
                        
                        if (collapse) {
                            panel.resizable('destroy');
                            content.hide();
                        } else {
                            panel.resizable(resizable);
                            content.css({
                                height: 'auto',
                                bottom: '0'
                            });
                        }
                    }
                 });
        },

        _onRefreshClicked: function () {

        }
    });
})(jQuery);