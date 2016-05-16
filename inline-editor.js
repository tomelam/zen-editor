// The techniques here should be checked for accuracy and up-to-dateness.

docClickHandler = function(event) {
    if (!event) var event = window.event;
    event.cancelBubble = true; // Don't let the event bubble up.
    event.stopImmediatePropagation(); // Works even in the capture phase.
    console.log("Doc click on " + event.target + ", with ID " + event.target.id);
    console.dir(event);
};

buttonClickHandler = function() {
    alert("Button click");
};

dojo.addOnLoad(function() {
    document.addEventListener('click', docClickHandler, true);
    document.getElementById('test-button').addEventListener('click', buttonClickHandler, false);
    if (document.captureEvents) {
	console.log("Enabling capture events for clicks");
    }
    console.log("Finished initialising the Simple Inline Editor");
});

    
