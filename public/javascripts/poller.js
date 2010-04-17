var Poller = {

    init : function() {
        this.count = 1;
        polling = true;
        this._startPolling();
        this._loadData();
        this.events();
    },

    events: function() {
        $(document).bind('keydown', 'ctrl+c', function() {
            if (confirm('Are you sure you wish to ' + ((!polling) ? 'resume' : 'pause') + ' updates?')) {
                Poller.toggle();
            }
        });
        $('.torrent-wrapper').live('click', function() {
            /* TODO: Toggle the menu */
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
                    Poller.update(item);
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
                Poller.buildRow(item);
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

    buildRow : function(item, prepend) {

        var status = this._getStatus(item);
        var $row = $('<div/>').addClass('torrent-wrapper').attr({ id: item['hash'] }).append(
            $('<div/>').addClass('torrent-name').text(item['name']).append(
                $('<span/>').text(item['size'])
            )
        ).append(
            $('<div/>').addClass(status).css({
                width: (Math.round(parseFloat(item['percentage']))) + '%'
            }).text(item['percentage'] + '%').attr('title', item['remaining'])
        )

        if (!prepend) {
            $row.appendTo('#torrents')
        } else {
            $row.prependTo('#torrents')
        }

        $row.addSwipeEvents().
            bind('swipe', function(evt, touch) {
            alert('Swipe event triggered!');
        })
    },

    update : function(item) {
        var $row = $("#" + item.hash + ' > .torrent');
        if ($row.length > 0) {

            var status = this._getStatus(item);
            $row
                .removeClass()
                .addClass(status)
                .css('width', (Math.round(parseFloat(item['percentage']))) + '%')
                .text(item['percentage'] + '%');
        } else {
            this.buildRow(item, true);
        }
    }
}
