$(document).ready(function() {

    $("#header").mouseover(function () {
        $("#button-bar").show();
    });

    $("#header").mouseout(function () {
        $("#button-bar").hide();
    });

    $('#add-button').click(function() {
        $("#add-input").toggle();
        $("#add-button").toggle();
    });

    $('#main').fadeIn("slow");

    $('#feed a').click(function() {
        var link = $(this);
        $.getJSON($(this).attr('href'), function(data) {
            if (data.downloaded) {
                $(link).fadeOut("slow");
            } else {
                alert('Couldn\'t download the file!');
            }
        });

        return false;
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

    $.getJSON('/torrent/feed/', function(data) {
        $.each(data, function(index,item) {
            $('<li>' + item.title + '</li>').appendTo($('#feed'));
        });
    });

});
