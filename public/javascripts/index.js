$(document).ready(function() {

    $("#header").mouseover(function () {
        $("#buttonBar").show();
        $("#beatBar").hide();
    });

    $("#header").mouseout(function () {
        $("#buttonBar").hide();
        $("#beatBar").show();
    });

    $('#addButton').click(function() {
        $("#addInput").toggle();
        $("#addButton").toggle();
    });

    $('#addForm').submit(function() {
        alert("TODO: Actually add the torrent");
    });

    $('#main').fadeIn("slow");

    $("#beatBar").heartBeat({
        delayBetweenAnimation:9000,
        delay:1000
    });

    $.getJSON('/torrent/info/', function(data) {
        var label = "";
        if (data.downloading) {
            label += data.downloading + " downloading, ";
        }
        if (data.completed) {
            label += data.completed + " completed";
        }
        $('div #status').html(label);
    });

    $.getJSON('/feed/entries/', function(data) {
        $.each(data, function(index, item) {
            $('#feed').tplAppend(item, function() {
                return [
                    'li', { className: 'text' }, [
                        'a', { href: item.link }, item.title
                    ]
                ];
            });
        });

        $('#feed a').click(function() {
            var link = $(this);
            $.getJSON('/torrent/add' , { torrent : $(this).attr('href') }, function(data) {
                if (!data.added) {
                    alert('Couldn\'t grab the torrent!');
                }
            });

            return false;
        });
    });

    $.getJSON('/index/files/', function(data) {
        $.each(data, function(index, item) {
            $('#incoming').tplAppend(item, function() {
                return [
                    'li', { className: 'folder' }, [
                        'a', { href: item }, item
                    ]
                ];
            });
        });
    });


});
