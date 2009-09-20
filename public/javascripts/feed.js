
    function __feedInit() {

        $.getJSON('/feed/entries/', function(data) {
            $.each(data, function(index, item) {
                $('#feed').tplAppend(item, function() {
                    return [
                        'li', { className: 'text' }, [ 'a', { href: item.link }, item.title ]
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
    }
