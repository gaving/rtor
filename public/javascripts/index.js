$(document).ready(function() {

    $("#torrentsTable").tablesorter();
    $("#torrentsTable").tableDnD();

    $("tr:odd").css("background-color", "#F4F4F8");
    $("tr:even").css("background-color", "#EFF1F1");

    $("#header").mouseover(function () {
        $("#button-bar").toggle();
    });

    $("#header").mouseout(function () {
        $("#button-bar").toggle();
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

});
