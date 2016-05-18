// The techniques here should be checked for accuracy and up-to-dateness.

require([
    "dojo/_base/lang",
    "dojo/date/stamp",
    "dojo/dom",
    
    "dijit/registry",
    "dijit/Dialog",
    "dijit/form/Button",
    
    "dojo/dom-construct",
    "dojo/on",
    "dojo/dom-class",
    "dojo/query",
    "dojo/NodeList-dom",
    
    // used by parser
    "dijit/Editor",
    "dijit/_editor/plugins/AlwaysShowToolbar",
    "dijit/InlineEditBox",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/MenuSeparator",
    "dijit/form/TextBox",
    "dijit/form/DateTextBox",
    "dijit/form/TimeTextBox",
    "dijit/form/FilteringSelect",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    
    "dojo/domReady!"
], function(lang, stamp, dom, registry, Dialog, Button, domConstruct, on, domClass, query){
    var dynDialog, editor, acceptButton, closeButton;

    docClickHandler = function(event) {
	if (!event) var event = window.event;
	console.dir(event);
	console.log("Doc click on " + event.target + ", with ID " + event.target.id + ", with srcElement.className '" + event.srcElement.className + "'");
	if (domClass.contains(event.srcElement, "zen-pic-slot")) {
	    createDialog();
	    showDialog();
	}
	if (!domClass.contains(event.srcElement, "zen-control")) {
	    event.cancelBubble = true; // Don't let the event bubble up.
	    event.stopImmediatePropagation(); // Works even in the capture phase.
	}
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
    
    createDialog = function() {
	if (!(dynDialog = dijit.byId("dynDialog"))) {
	    var tree, html = '<div id="editorDialog" style="display: none;">';
	    html += '<textarea id="dialogTextarea" style="width: 90%" placeholder="enter text here"></textarea>';
	    html += '<br><div id="editButton"></div><div id="editCloseButton"></div>';
	    tree = domConstruct.toDom(html);
	    domConstruct.place(tree, "editorDialogContainer");
	    
	    console.info("creating dialog");
	    console.group("domClass");
	    console.dir(domClass);
	    console.groupEnd();
	    var pane = dom.byId('editorDialog');
	    // should specify a width on dialogs with <p> tags, otherwise they get too wide
	    dynDialog = new dijit.Dialog({
		id: "dynDialog",
		title: "Edit Attribute",
		style: {width: '300px'}
	    },pane);
	    domClass.add(dynDialog.domNode, "zen-control");
	    
	    acceptButton = new Button({
		label: "Accept",
		onClick: function(){
		    editor = dom.byId("editor");
		    newVal = dom.byId("dialogTextarea").value;
		    console.log("focusing editor and setting value to " + newVal);
		    editor.focus();
		    editor.value = newVal;
		}
	    }, "editButton").startup();
	    
	    closeButton = new Button({
		label: "Close",
		onClick: function(){
		    dynDialog.hide();
		}
	    }, "editCloseButton").startup();

	    dynDialog = dijit.byId("dynDialog"), acceptButton = dijit.byId("editButton"), closeButton = dijit.byId("editCloseButton");
	    console.log("dynDialog => " + dynDialog + ", acceptButton => " + acceptButton + ", closeButton => " + closeButton);
	    console.group("acceptButton");
	    console.dir(acceptButton);
	    console.groupEnd();

	    // Add the "zen-control" class to the following elements to allow click events to pass to them.
	    domClass.add("editButton_label", "zen-control");
	    domClass.add("editCloseButton_label", "zen-control");
	    query("input").forEach(function(node){
		domClass.add(node, "zen-control");
	    });




	}
    };
    
    destroyDialog = function() {
	dynDialog = dijit.byId("dynDialog");
	acceptButton = dijit.byId("editButton");
	closeButton = dijit.byId("editCloseButton");
	console.info("destroying dialog");
	console.log("acceptButton => " + acceptButton + ", closeButton => " + closeButton);
	acceptButton.destroy();
	console.log("Destroyed acceptButton? " + dijit.byId("editButton"));
	closeButton.destroy();
	console.log("Destroyed closeButton? " + dijit.byId("closeButton"));
	console.log("dynDialog => " + dynDialog);
	dynDialog.destroy();
	console.log("Destroyed dynDialog? " + dijit.byId("dynDialog"));
    };
    
    showDialog = function(){
	editor = dom.byId("editor");
	dom.byId("dialogTextarea").value = editor.value;
	dynDialog.show();
    };
    
});
