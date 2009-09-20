
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
