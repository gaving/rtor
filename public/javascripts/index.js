
var RTOR = {

    init: function() {

        $('#main').fadeIn("slow");

        $("#header").mouseover(function () {
            $("#buttonBar").show();
        }).mouseout(function () {
            $("#buttonBar").hide();
        });

        this.updateTitle();
        this.module();
    },

    module: function() {
        Poller.init();
    },

    flash: function(msg) {
        $.jnotifica(msg,{
            margin : 10,
            width  : 400,
            effect : 'fade',
            close : false,
            padding: 25,
            msgCss : {
                textAlign : 'center',
                fontSize  : '138.5%',
                fontWeight: 'bold'
            }
        });
    },

    updateTitle: function() {
        _callTorrentController('info', {}, function(data) {
            var label = "";
            if (data.downloading) {
                label += data.downloading + " downloading, ";
            }
            if (data.completed) {
                label += data.completed + " completed";
            }
            $('div #status').html(label);
            $('title').text(label);
        });
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
