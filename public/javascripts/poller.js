var Poller = {

    init : function() {
        this.count = 1;
        polling = true;
        this._startPolling();
        this._loadData();
        this.events();
        this.menu();
    },

    events: function() {
        $(document).bind('keydown', 'ctrl+c', function() {
            if (confirm('Are you sure you wish to ' + ((!polling) ? 'resume' : 'pause') + ' _updates?')) {
                Poller.toggle();
            }
        });
        // $('.torrent-wrapper').live('click', this.buildMenu);
    },

    buildMenu: function(e) {
        var $menu = $(this).find('.menu');
        $('.menu').not($('#content > .menu')).not($menu).each(function() {
            $(this).closest('.torrent').text($(this).closest('.torrent-wrapper').data('percent'));
            $(this).remove();
        });
        if ($menu.length > 0) {
            $menu.remove();
            $(this).find('.torrent').text($(this).data('percent'));
        } else {
            $('.menu').clone().appendTo($(this).find('.torrent').empty()).show();
        }
    },

    menu: function() {
        $('li.state', '.menu').live('click', function() {
            alert('Toggle state!');
        });
        $('li.remove', '.menu').live('click', function() {
            if (confirm('Are you sure you want to remove this torrent?')) {
                var $wrapper = $(this).closest('.torrent-wrapper');
                $.getJSON('/torrent/erase/' + $wrapper.data('hash'), function(data) {
                    if (data.erased) {
                        RTOR.flash($wrapper.data('name') + " deleted");
                        $wrapper.fadeOut("slow");
                    } else {
                        RTOR.flash('Error: Couldn\'t delete!');
                    }
                });
            }
        });
    },

    _startPolling : function() {
        $("#wrapper").poll({
            url: "/torrent/torrents/",
            interval: 5000,
            type: "GET",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i,item) {
                    Poller._update(item);
                });
            }
        });
    },

    toggle : function() {
        polling = !polling;
        if (polling) {
            this._startPolling();
        }
    },

    _loadData : function() {
        _callTorrentController('torrents', {}, function(data) {
            $.each(data, function(index,item) {
                Poller._buildRow(item);
            });

            $('#wrapper').fadeIn("slow");
            $('#spinner').hide();
        });
    },

    _getStatus: function(item) {
        var status = (item.complete == 1 ? 'complete' : (item.is_checking == 1 ? 'hashing' : 'incomplete'));
        status += (item.is_active == 0 ? ' stopped' : ' active')
        return "torrent " + status;
    },

    _buildRow : function(item, prepend) {

        var status = this._getStatus(item);
        var $row = $('<div/>').addClass('torrent-wrapper').attr({ id: item['hash'] }).append(
            $('<div/>').addClass('torrent-name').text(item['name']).append(
                $('<span/>').text(item['size'])
            )
        ).append(
            $('<div/>').addClass(status).css({
                width: (Math.round(parseFloat(item['percentage']))) + '%'
            }).text(item['percentage'] + '%').attr('title', item['remaining'] + " remaining")
        ).data({
            'hash': item['hash'],
            'percent': item['percentage'] + "%",
            'name': item['name']
        });

        if (!prepend) {
            $row.appendTo('#torrents')
        } else {
            $row.prependTo('#torrents')
        }

        $row.addSwipeEvents().bind('swipe', this.buildMenu);
    },

    _update : function(item) {
        var $row = $("#" + item.hash + ' > .torrent');
        if ($row.length > 0) {

            var status = this._getStatus(item);
            if ($row.find('.menu').length == 0) {
                $row
                    .removeClass()
                    .addClass(status)
                    .css('width', (Math.round(parseFloat(item['percentage']))) + '%')
                    .text(item['percentage'] + '%');
            }
        } else {
            this._buildRow(item, true);
        }
    }
}
