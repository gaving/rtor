
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
                            flash("Torrent started");
                            $(item).removeClass("stopped");
                            $(item).addClass("active");
                        } else {
                            flash('Error: Couldn\'t start!');
                        }
                    });
                },
                'stop': function(t) {
                    var item = $(t);
                    $.getJSON('/torrent/stop/' + $(t).attr('id'), function(data) {
                        if (data.stopped) {
                            flash("Torrent stopped");
                            $(item).removeClass("active");
                            $(item).addClass("stopped");
                        } else {
                            flash('Error: Couldn\'t stop!');
                        }
                    });
                },
                'delete': function(t) {
                    if (confirm('Are you sure you want to delete this torrent?')) {
                        var item = $(t);
                        $.getJSON('/torrent/erase/' + $(t).attr('id'), function(data) {
                            if (data.erased) {
                                flash("Torrent deleted");
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

        $.tablesorter.addParser({
            id: 'filesize',
            is: function(s) {
                return s.match( new RegExp(/[0-9]+(\.[0-9]+)?\ (Bytes|KB|B|GB|MB|TB)/));
            },
            format: function(s) {
                var suf = s.match(new RegExp(/(Bytes|KB|B|GB|MB|TB)$/))[1];
                var val = s.match(new RegExp(/^[0-9]+(\.[0-9]+)?/));

                if (typeof(val) == undefined || !val) {
                    return 0;
                }

                var num = parseFloat(val[0]);

                switch (suf) {
                    case 'B':
                    return num;
                    case 'KB':
                    return num * 1024;
                    case 'MB':
                    return num * 1024 * 1024;
                    case 'GB':
                    return num * 1024 * 1024 * 1024;
                    case 'TB':
                    return num * 1024 * 1024 * 1024 * 1024;
                    default:
                    return num;
                }
            },
            type: 'numeric'
        });

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
        $.each(data, function(index,item) {
            buildRow(item);
        });

        __hookTableHandlers();
    }

    function buildRow(item) {

        var status = (item.complete == 1 ? 'complete' : (item.is_checking == 1 ? 'hashing' : 'incomplete'));

        $('#torrentsTable tbody').tplAppend(item, function() {
            return [
                'tr', { className: 'menu' + (this.is_active == 0 ? ' stopped' : ''), id: this.hash }, [
                    'td',, [ 'img', { src: "/images/icons/" + this.mime_img + ".png" } ],
                        'td',, this.name,
                        'td',, [
                            'div', { className: 'progressContainer' }, [
                                'div', { className: status, style: { 'width': this.percentage + "%" } }, [
                                    'div', { className: 'progressText' }, this.percentage + "%"
                                ]
                            ]
                        ],
                    'td',, this.size,
                    'td',, this.remaining,
                    'td',, this.down_rate,
                    'td',, this.up_rate,
                    'td', { className: 'ratioCell' }, [
                        'img', { src: "/images/icons/" + this.ratio_img + ".png" }
                    ]
                ]
            ];
        });
    }

    function processData(item) {

        var status = (item.complete == 1 ? 'complete' : (item.is_checking == 1 ? 'hashing' : 'incomplete'));
        var isActive = (item.is_active == 1)

        var order = [
            "<div class='progressContainer'><div class='" + status + "' style='width: " + item.percentage + "%'><div class='progressText'>" + item.percentage + "%</div></div></div>",
            item.size,
            item.remaining,
            item.down_rate,
            item.up_rate,
            "<img src='/images/icons/" + item.ratio_img + ".png'"
        ];

        /* Find the row for the current item (if there is one) */
        var $row = $("#" + item.hash);

        if ($row.attr('id')) {

            if (item.is_active) {
                $row.removeClass("stopped");;
                $row.addClass("active");
            } else {
                $row.removeClass("active");;
                $row.addClass("stopped");
            }

            $row.children('td:gt(1)').each(function(index, cell) {

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

