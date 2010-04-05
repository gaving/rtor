
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
            __callAddDialog();
            this.toggle();
        });

        $('#main').fadeIn("slow");

        $("#beatBar").heartBeat({
            delayBetweenAnimation:9000,
            delay:1000
        });
    }

    function __callAddDialog() {
        $("#dialog").load('/index/add', function() {
            $(this).dialog({
                title: 'Add torrent',
                position: 'middle',
                resizable: false,
                bgiframe: true,
                modal: true,
                width: 660,
                overlay: {
                    backgroundColor: '#000',
                    opacity: 0.5
                },
                buttons: {
                    Add: function() {

                        /* Close the dialog on submit */
                        // $(this).dialog('close');
                        // $(this).dialog('destroy');
                    },
                    Cancel: function() {
                        // $(this).dialog('close');
                        $(this).dialog('destroy');
                        // $(this).remove();
                    }
                }
            });
        });
    }
