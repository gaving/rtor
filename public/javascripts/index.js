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

    $('tr.menu').contextMenu('torrentContext', {

            bindings: {
                'open': function(t) {
                    alert('Trigger was '+t.id+'\nAction was Open');
                },
                'start': function(t) {
                    var item = $(t);
                    $.getJSON('/torrent/start/' + $(t).attr('hash'), function(data) {
                        if (data.started) {
                            $(item).removeClass("stopped");
                            $(item).addClass("active");
                        } else {
                            alert('Couldn\'t start!');
                        }
                    });
                },
                'stop': function(t) {
                    var item = $(t);
                    $.getJSON('/torrent/stop/' + $(t).attr('hash'), function(data) {
                        if (data.stopped) {
                            $(item).removeClass("active");
                            $(item).addClass("stopped");
                        } else {
                            alert('Couldn\'t stop!');
                        }
                    });
                },
                'delete': function(t) {
                    if (confirm('Are you sure you want to delete this torrent?')) {
                        var item = $(t);
                        $.getJSON('/torrent/erase/' + $(t).attr('hash'), function(data) {
                            if (data.erased) {
                                $(item).fadeOut("slow");
                            } else {
                                alert('Couldn\'t delete!');
                            }
                        });
                    }
                }
            }
    });

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
});
