
/*------------------ DOC READY --------------*/
/*
	jQuery's document.ready/$(function(){}) should
	you wish to use a cross-browser DOMReady solution
	without opting for a library.
	Parts: jQuery project, Diego Perini, Lucent M.
	This version: Addy Osmani
*/
(function( window ) {
	"use strict";

	// Define a local copy of $d
	var $d = function( callback ) {
			readyBound = false;
			$d.isReady = false;
			if ( typeof callback === "function" ) {
				DOMReadyCallback = callback;
			}
			bindReady();
		},

		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,
		readyBound = false,
		DOMReadyCallback = function() {},

		// The ready event handler
		DOMContentLoaded = function() {
			if ( document.addEventListener ) {
					document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			} else {
					// we're here because readyState !== "loading" in oldIE
					// which is good enough for us to call the dom ready!
					document.detachEvent( "onreadystatechange", DOMContentLoaded );
			}
			DOMReady();
		},

		// Handle when the DOM is ready
		DOMReady = function() {
			// Make sure that the DOM is not already loaded
			if ( !$d.isReady ) {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( !document.body ) {
					return setTimeout( DOMReady, 1 );
				}
				// Remember that the DOM is ready
				$d.isReady = true;
				// If there are functions bound, to execute
				DOMReadyCallback();
				// Execute all of them
			}
		}, // /ready()

		bindReady = function() {
			var toplevel = false;

			if ( readyBound ) {
				return;
			}
			readyBound = true;

			// Catch cases where $ is called after the
			// browser event has already occurred.
			if ( document.readyState !== "loading" ) {
				DOMReady();
			}

			// Mozilla, Opera and webkit nightlies currently support this event
			if ( document.addEventListener ) {
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", DOMContentLoaded, false );
				// If IE event model is used
			} else if ( document.attachEvent ) {
				// ensure firing before onload,
				// maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", DOMContentLoaded );
				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", DOMContentLoaded );
				// If IE and not a frame
				// continually check to see if the document is ready
				try {
					toplevel = window.frameElement == null;
				} catch (e) {}
				if ( document.documentElement.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		},

		// The DOM ready check for Internet Explorer
		doScrollCheck = function() {
			if ( $d.isReady ) {
				return;
			}
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch ( error ) {
				setTimeout( doScrollCheck, 1 );
				return;
			}
			// and execute any waiting functions
			DOMReady();
		};

	// Is the DOM ready to be used? Set to true once it occurs.
	$d.isReady = false;

	// Expose $d to the global object
	window.$d = $d;

})( window );

$d(function(){
	var feedback_btn = document.getElementById("site-feedback");

	feedback_btn.onclick = function(){

		var body = document.body;

		bkgrBox = document.createElement("div");
		bkgrBox.id = "feedback-box";
		bkgrBox.style.position = "absolute";
		bkgrBox.style.width = window.innerWidth + "px";
		bkgrBox.style.height = window.innerHeight + "px"
		bkgrBox.style.backgroundColor = "#283540";
		bkgrBox.style.opacity = 0.5;
		bkgrBox.style.position = "absolute";
		bkgrBox.style.top = "0px";
		bkgrBox.style.left = "0px";
		bkgrBox.style.zIndex = 9999;
		body.appendChild(bkgrBox);

		var frame = document.createElement('iframe');
		frame.id = "feedback-frame";
		var fw = 662;
		var fh = 404;
		frame.src = "http://127.0.0.1:5000/"
		frame.style.width = fw + "px";
		frame.style.height = fh + "px";
		frame.style.position = "absolute";
		frame.style.zIndex = 10000;
		frame.style.padding = 0;
		frame.style.margin = 0;
		frame.style.overflow = 'hidden';
		frame.style.top = (window.innerHeight/2)-(fh/2) + "px";
		frame.style.left = (window.innerWidth/2)-(fw/2) + "px";
		frame.scrolling = 'no';
		frame.style.border = 'none';
		body.appendChild(frame);

		var exitBtn = document.createElement("img");
		exitBtn.id = "exit-btn";
		exitBtn.src = "static/images/closeBtn.png";
		exitBtn.style.width = 20 + "px";
		exitBtn.style.height = 20 + "px";
		exitBtn.style.position = "absolute";
		exitBtn.style.zIndex = 12000;
		exitBtn.style.top = (window.innerHeight/2)-(fh/2) - 6 + "px";
		exitBtn.style.left = (window.innerWidth/2)+(fw/2) - 15 + "px";	
		body.appendChild(exitBtn);

		exitBtn.onmouseover = function(){
			exitBtn.style.border = "2px solid #A6CDFF";
		}
		exitBtn.onmouseout = function(){
			exitBtn.style.border = "none";
		}

		exitBtn.onclick = function(){
			removeFeedbackBox();
		}

		bkgrBox.onclick = function(){
			removeFeedbackBox();
		}

		removeFeedbackBox = function(){
			body.removeChild(frame);
			body.removeChild(exitBtn);
			body.removeChild(bkgrBox);
		}




	}//end feedback_btn onclick

});