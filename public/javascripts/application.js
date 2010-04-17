    function flash(message) {
        $('.notice').html(message).fadeTo("slow", 1).animate({opacity: 1.0}, 3000).fadeTo("slow", 0);  
    }
