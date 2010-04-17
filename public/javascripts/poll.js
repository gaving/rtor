(function($) {
    $.fn.poll = function(options) {
        var $this = $(this);
        var opts = $.extend({}, $.fn.poll.defaults, options);
        var interval = setInterval(update, opts.interval);
        function update() {
            if (polling) {
                $.ajax({
                    type: opts.type,
                    dataType: opts.dataType,
                    cache: opts.cache,
                    url: opts.url,
                    success: opts.success
                });
            } else {
                clearInterval(interval);
            }
        }
    };

    $.fn.poll.defaults = {
        type: "POST",
        url: ".",
        dataType: "html",
        cache: false,
        success: '',
        interval: 2000
    };
})(jQuery);
