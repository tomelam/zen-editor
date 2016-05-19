require(["dojo/domReady!"], function() {
    console.log("DOM ready");
    require(["dojo/mouse", "dojo/dom", "dojo/on"], function(mouse, dom, on) {
    });
});

require(["dojo/keys", "dojo/dom", "dojo/query", "dojo/on", "zen/inline-editor", "dojo/domReady!"],
	function(keys, dom, query, on, inlineEditor) {
	    console.log("Setting up the ESCAPE handler (based upon a keydown-event handler)");
	    on(document.body, "keydown", function(evt) {
		var charOrCode = evt.charCode || evt.keyCode;
		console.log("Key " + charOrCode);
		if (charOrCode === keys.ESCAPE) {
		    console.log("ESCAPE");
		    inlineEditor.createDialog();
		};
	    });
	    
});
