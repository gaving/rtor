
    $(document).ready(function() {

        __torrentInit(function() {
            __feedInit();
            __filesInit();
            __pollInit();
            __hookEvents();
        });
    });


    function __callTorrentController(controller, hash, success, failure) {
        $.ajax({
            type: 'GET',
            url: '/torrent/' + controller,
            data: hash,
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (success !== undefined) {
                    success(data);
                }
            },
            error: function(data) {
                if (failure !== undefined) {
                    failure(data);
                }
            }
        });
    }

    function __hookEvents() {
        $(document).bind('keydown', 'ctrl+c', function() { __hookTogglePoller(); });
    }

    function __hookTogglePoller() {
        if (confirm('Are you sure you wish to ' + ((!polling) ? 'resume' : 'pause') + ' updates?')) {
            __togglePoller();
        }
    }
