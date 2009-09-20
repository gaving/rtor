
    function __filesInit() {

        $.getJSON('/index/files/', function(data) {
            $.each(data, function(index, item) {
                $('#incoming').tplAppend(item, function() {
                    return [
                        'li', { className: 'folder' }, [ 'a', { href: item }, item ]
                    ];
                });
            });
        });
    }
