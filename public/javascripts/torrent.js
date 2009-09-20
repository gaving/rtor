
    function __torrentInit(callback) {

        __callTorrentController('info', {}, function(data) {
            var label = "";
            if (data.downloading) {
                label += data.downloading + " downloading, ";
            }
            if (data.completed) {
                label += data.completed + " completed";
            }
            $('div #status').html(label);

            __hookTorrentEvents();

            if (callback !== undefined) {
                callback();
            }
        });
    }

    function __hookTorrentEvents() {

        $("#header").mouseover(function () {
            $("#buttonBar").show();
            $("#beatBar").hide();
        }).mouseout(function () {
            $("#buttonBar").hide();
            $("#beatBar").show();
        });

        $('#addButton').click(function() {
            $("#addInput").toggle();
            this.toggle();
        });

        $('#addForm').submit(function() {
            alert("TODO: Actually add the torrent");
        });

        $('#main').fadeIn("slow");

        $("#beatBar").heartBeat({
            delayBetweenAnimation:9000,
            delay:1000
        });
    }
