
    function __pollInit() {

        polling = true;

        (function($) {
            $.fn.poll = function(options) {
                var $this = $(this);
                var opts = $.extend({}, $.fn.poll.defaults, options);
                var interval = setInterval(update, opts.interval);
                function update() {

                    if (polling) {
                        $.ajax({
                            type: opts.type,
                            dataType: opts.dataType,
                            cache: opts.cache,
                            url: opts.url,
                            success: opts.success
                        });
                    } else {

                        /* Not polling anymore, nuke this timer */
                        clearInterval(interval);
                    }
                }
            };

            $.fn.poll.defaults = {
                type: "POST",
                url: ".",
                dataType: "html",
                cache: false,
                success: '',
                interval: 2000
            };
        })(jQuery);

        __initPoller();

        __loadTable();
    }

    function __initPoller() {

        $("#torrentsTable").poll({
            url: "/torrent/torrents/",
            interval: 5000,
            type: "GET",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i,item) {

                    /* Process the updated torrent information */
                    processData(item);
                });
            }
        });
    }
    function __togglePoller() {

        /* Toggle the polling */
        polling = !polling;
        if (polling) {

            /* Re-initialize the poller */
            __initPoller();
        }
    }

    function __loadTable() {

        /* Load up the initial table */
        __callTorrentController('torrents', {}, function(data) {

            /* Build our initial table of torrents on entry */
            buildTable(data);

            /* Display it */
            $('#torrentsTable').fadeIn("slow");
            $('#spinner').hide();
        });
    }

    function __buildMenu() {
        $('tr.menu').contextMenu('torrentContext', {
            bindings: {
                'open': function(t) {
                    $.getJSON('/torrent/open/' + $(t).attr('id'), function(data) {
                        alert(data['path']);
                    });
                },
                'start': function(t) {
                    var item = $(t);
                    $.getJSON('/torrent/start/' + $(t).attr('id'), function(data) {
                        if (data.started) {
                            $(item).removeClass("stopped");
                            $(item).addClass("active");
                        } else {
                            alert('Error: Couldn\'t start!');
                        }
                    });
                },
                'stop': function(t) {
                    var item = $(t);
                    $.getJSON('/torrent/stop/' + $(t).attr('id'), function(data) {
                        if (data.stopped) {
                            $(item).removeClass("active");
                            $(item).addClass("stopped");
                        } else {
                            alert('Error: Couldn\'t stop!');
                        }
                    });
                },
                'delete': function(t) {
                    if (confirm('Are you sure you want to delete this torrent?')) {
                        var item = $(t);
                        $.getJSON('/torrent/erase/' + $(t).attr('id'), function(data) {
                            if (data.erased) {
                                $(item).fadeOut("slow");
                            } else {
                                alert('Error: Couldn\'t delete!');
                            }
                        });
                    }
                }
            }
        });
    }

    function __hookTableHandlers() {

        /* Attach the table sorter */
        $("#torrentsTable").tablesorter();

        /* Attach the drag and drop */
        $("#torrentsTable").tableDnD();

        /* Colour the table rows */
        $("tr:odd").addClass('odd');
        $("tr:even").addClass('even');

        /* Set up the context menu for each click */
        __buildMenu();
    }

    function buildTable(data) {

        /* Build each table row */
        $.each(data,function(index,item) {
            buildRow(item);
        });

        __hookTableHandlers();
    }

    function buildRow(item) {

        $('#torrentsTable tbody').tplAppend(item, function() {
            return [
                'tr', { className: 'menu' + (this.state === 0 ? ' stopped' : ''), id: this.hash }, [
                    'td',, [ 'img', { src: "/images/icons/" + this.mime_img + ".png" } ],
                        'td',, this.name,
                        'td',, [
                            'div', { className: 'prog-border' }, [
                                'div', { className: 'prog-bar', style: { 'width': this.percentage + "%" } }, [
                                    'div', { className: 'prog-text' }, this.percentage + "%"
                                ]
                            ]
                        ],
                        'td',, this.size,
                        'td',, this.remaining,
                        'td',, this.down_rate,
                        'td',, this.up_rate,
                        'td', { style: { 'text-align': 'center' } }, [ 'img', { src: "/images/icons/" + this.ratio_img + ".png" } ]
                ]
            ];
        });
    }

    function processData(item) {

        var order = [
            "<img src='/images/icons/" + item.mime_img + ".png'",
            item.name,
            "<div class='prog-border'><div class='prog-bar' style='width: " + item.percentage + "%'><div class='prog-text'>" + item.percentage + "%</div></div></div>",
            item.size,
            item.remaining,
            item.down_rate,
            item.up_rate,
            "<img src='/images/icons/" + item.ratio_img + ".png'"
        ];

        /* Find the row for the current item (if there is one) */
        var row = $("#" + item.hash);

        if ($(row).attr('id')) {
            $($(row).children('td')).each(function(index, cell) {

                /* Set all the cells in some sort of order */
                $(cell).html(order[index]);
            });
        } else {

            /* Create a new row for this unknown item */
            buildRow(item);

            /* Attach the handlers again */
            __hookTableHandlers();
        }
    }

