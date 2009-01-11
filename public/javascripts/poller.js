$(document).ready(function() {

    (function($) {
        $.fn.poll = function(options) {
            var $this = $(this);
            var opts = $.extend({}, $.fn.poll.defaults, options);
            setInterval(update, opts.interval);
            function update(){
                $.ajax({
                    type: opts.type,
                    url: opts.url,
                    success: opts.success
                });
            };
        };

        $.fn.poll.defaults = {
            type: "POST",
            url: ".",
            success: '',
            interval: 2000
        };
    })(jQuery);

    function buildMenu() {
        $('tr.menu').contextMenu('torrentContext', {
            bindings: {
                'open': function(t) {
                    alert('Trigger was '+t.id+'\nAction was Open');
                },
                'start': function(t) {
                    var item = $(t);
                    $.getJSON('/torrent/start/' + $(t).attr('hash'), function(data) {
                        if (data.started) {
                            $(item).removeClass("stopped");
                            $(item).addClass("active");
                        } else {
                            alert('Couldn\'t start!');
                        }
                    });
                },
                'stop': function(t) {
                    var item = $(t);
                    $.getJSON('/torrent/stop/' + $(t).attr('hash'), function(data) {
                        if (data.stopped) {
                            $(item).removeClass("active");
                            $(item).addClass("stopped");
                        } else {
                            alert('Couldn\'t stop!');
                        }
                    });
                },
                'delete': function(t) {
                    if (confirm('Are you sure you want to delete this torrent?')) {
                        var item = $(t);
                        $.getJSON('/torrent/erase/' + $(t).attr('hash'), function(data) {
                            if (data.erased) {
                                $(item).fadeOut("slow");
                            } else {
                                alert('Couldn\'t delete!');
                            }
                        });
                    }
                }
            }
        });
    }

    function buildTable(data) {
        $.each(data,function(index,item) {
            var tpl = function() {
                return [
                    'tr', { className: 'menu', id: this.hash }, [
                        'td',, [
                            'img', { src: "images/icons/" + this.mime_img + ".png" }
                        ],
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
                        'td',, this.downloaded,
                        'td',, this.uploaded,
                        'td',, this.down_rate,
                        'td',, this.up_rate,
                        'td',, [
                            'img', { src: "images/icons/" + this.ratio_img + ".png" }
                        ]
                    ]
                ];
            };

            $('#torrentsTable tbody').tplAppend(item, tpl);
        });

        /* Attach the table sorter */
        $("#torrentsTable").tablesorter();

        /* Attach the drag and drop */
        $("#torrentsTable").tableDnD();

        /* Set up the context menu for each click */
        buildMenu();
    }

    function processData(data) {

        /* Oh christ so gross */
        $.each(data,function(i,item) {
            var order = [
                "<img src='images/icons/" + item.mime_img + ".png'",
                item.name,
                "<div class='prog-border'><div class='prog-bar' style='width: " + item.percentage + "%'><div class='prog-text'>" + item.percentage + "%</div></div></div>",
                item.size,
                item.remaining,
                item.downloaded,
                item.uploaded,
                item.down_rate,
                item.up_rate,
                "<img src='images/icons/" + item.ratio_img + ".png'",
            ];
            var row = $("#" + item.hash);
            $($(row).children('td')).each(function(index, cell) {
                $(cell).html(order[index]);
            });
        });
    }

    $("#torrentsTable").poll({
        url: "/torrent/torrents/",
        interval: 1000,
        type: "GET",
        success: function(data) {
            data = eval("(" + data + ")");

            /* Process the updated torrent information */
            processData(data);
        }
    });

    $.getJSON('/torrent/torrents/', function(data) {

        /* Build our initial table of torrents */
        buildTable(data);
    });


});
