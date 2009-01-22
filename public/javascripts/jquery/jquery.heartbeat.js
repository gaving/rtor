// Plugin: heartbeat.
//
// Author : Nordès Ménard-Lamarre
// Last modif: 08/08/08
// Licence: This code is under the MIT license
// Version: 0.1
//
// Copyright (c) 2008 Nordès Ménard-Lamarre
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function($) {
	$.fn.heartBeat = function(options){
		// Heart beat plugin
		//
		// build main options before element iteration
		var opts = $.extend({}, $.fn.heartBeat.defaults, options);
		
		// Apply the modification on each item in the selector.
		return this.each(function() {
			var $this = $(this);
			// build element specific options
			var o = opts;
			
		 if (!o.alwaysBeat){
			$this.bind("mouseover", function(){
					// set the interval
					// TODO
				})
				.bind("mouseout", function(){
					// clear the interval
					// TODO
				});
		 }
		 else {
			 var myThis = $(this);
			 $.fn.heartBeat.start($(this), o);
			 var intervalFct = function(){ $.fn.heartBeat.start(myThis, o); }; // Fix for setInterval bug between browser
			 var intervalId = setInterval(intervalFct, o.delayBetweenAnimation + o.delay * 2);
			 $(this).attr("intervalId", intervalId); 
		 }
			
		});
	};
	
	$.fn.heartBeat.start = function(thisItem, options) {
		var opts = $.extend({}, $.fn.heartBeat.defaults, options);

		if (thisItem.css("opacity") == opts.opacityMax){
			thisItem.fadeTo(opts.delay, opts.opacityMin, function(){ thisItem.fadeTo(opts.delay, opts.opacityMax); });
		}
	};
	
	$.fn.heartBeat.stopHeartBeat = function(options){
		// Stop the heart beat.
		return this.each(function() {
			var intervalId = $(this).attr("intervalId");
			clearInterval(intervalId);
			$(this).attr("intervalId", 0);
		});
	}

	$.fn.heartBeat.defaults = {
		opacityMax: "1",
		opacityMin: "0.5",
		delay:"75", // in ms
		delayBetweenAnimation: 1000,
		alwaysBeat: true
	};
	
 })(jQuery);