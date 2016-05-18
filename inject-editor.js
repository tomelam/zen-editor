require(["dojo/domReady!"], function() {
    console.log("DOM ready");
    require(["dojo/mouse", "dojo/dom", "dojo/on"], function(mouse, dom, on) {
	console.log("Setting event handler on mouse event");
	on(dom.byId("pic-slot-4"), mouse.enter, function(evt){
	    console.log("Mouse entered region");
            require(["zen/inline-editor"],
		    function(inlineEditor) {
			inlineEditor.createDialog();
			inlineEditor.showDialog();
		    });
	});
    });
});

/*
require(["dojo/domReady!"], function() {
    require(["dojo/keys", "dojo/dom", "dojo/on"], function(keys, dom, on) {
	console.log("Setting event handler on keypress event");
	on(dom.byId("editor"), "keypress", function(evt) {
	    var charOrCode = evt.charCode || evt.keyCode;
	    switch(evt.charOrCode) {
	    case keys.LEFT_ARROW:
	    case keys.UP_ARROW:
	    case keys.DOWN_ARROW:
	    case keys.RIGHT_ARROW:
		console.log("You pressed an arrow key");
		break;
	    case keys.BACKSPACE:
		console.log("You pressed the backspace");
		break;
	    case keys.TAB:
		console.log("You pressed the tab key");
		break;
	    case keys.ESCAPE:
		console.log("You pressed the escape key");
		break;
	    default:
		console.log("You pressed some other key: " + charOrCode);
		if (charOrCode == 101) {
		    console.log("You pressed the 'e' key");
		}
	    }
	});
    });
});
*/
