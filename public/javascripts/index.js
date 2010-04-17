
var RTOR = {

    init: function() {

        $('#main').fadeIn("slow");

        _callTorrentController('info', {}, function(data) {
            var label = "";
            if (data.downloading) {
                label += data.downloading + " downloading, ";
            }
            if (data.completed) {
                label += data.completed + " completed";
            }
            $('div #status').html(label);
        });

        this.module();
    },

    module: function() {
        Poller.init();
    }
}

$(document).ready(function() {
    RTOR.init();
});

function _callTorrentController(controller, hash, success, failure) {
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
