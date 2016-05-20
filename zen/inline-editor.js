define(["dojo/mouse", "dojo/dom", "dijit/Dialog", "dijit/form/Button", "dojo/dom-construct", "dojo/on", "dojo/dom-class", "dojo/query"],

       function(mouse, dom, Dialog, Button, domConstruct, on, domClass, query) {
	   ile = function() {};
	   var dynDialog, editor, acceptButton, closeButton, clickedOnNode;

	   console.log("Defining docEventHandler to use the capture phase of event processing (but not attaching it yet)");
	   ile.docEventHandler = function(event) {
	       if (!event) var event = window.event;
	       console.log("Doc click on " + event.target + ", with ID " +
			   event.target.id + ", with srcElement.className '" + event.srcElement.className + "'");
	       if (domClass.contains(event.srcElement, "demo-pic-img")) {
		   ile.createDialog(event.srcElement);
		   ile.showDialog(event.srcElement);
	       }
	       if (!domClass.contains(event.srcElement, "zen-control")) {
		   event.cancelBubble = true; // Don't let the event bubble up.
		   event.stopImmediatePropagation(); // Works even in the capture phase.
	       }
	   };
	   
	   ile.createDialog = function() {
	       console.info("Creating Dialog (and leaving it hidden)");

	       console.log("Add docEventHandler to the document node to handle all clicks (TODO:  all events, not just clicks)");
	       document.addEventListener('click', ile.docEventHandler, true);

	       if (!(dynDialog = dijit.byId("dynDialog"))) {
		   var tree, html = '<div id="editorDialog" style="display: none;">';
		   html += '<strong>Image URL</strong>';
		   html += '<textarea id="dialogImageURL" style="width: 90%" placeholder="enter text here"></textarea>';
		   html += '<strong>Caption</strong>';
		   html += '<textarea id="dialogFigureCaption" style="width: 90%" placeholder="enter text here"></textarea>';
		   html += '<strong>Subtext</strong>';
		   html += '<textarea id="dialogSubtext" style="width: 90%" placeholder="enter text here"></textarea>';
		   html += '<br><div id="editButton"></div><div id="editCloseButton"></div>';
		   tree = domConstruct.toDom(html);
		   console.log("Constructing and placing the HTML elements for the Dialog");
		   domConstruct.place(tree, "editorDialogContainer");

		   console.log("Turning the HTML elements into a Dialog");
		   var pane = dom.byId('editorDialog');
		   // should specify a width on dialogs with <p> tags, otherwise they get too wide
		   dynDialog = new dijit.Dialog({
		       id: "dynDialog",
		       title: "Edit Attributes",
		       style: {width: '300px'}
		   },pane);
		   domClass.add(dynDialog.domNode, "zen-control");
		   
		   console.log("Add the Accept Button");
		   acceptButton = new Button({
		       label: "Accept",
		       onClick: function(){
			   urlEditor = dom.byId("dialogImageURL");
			   newVal = dom.byId("dialogImageURL").value;
			   console.log("Focusing editor and setting value to " + newVal);
			   clickedOnNode.src = newVal;
			   //FIXME: Is there a 'focus' method to call?
		       }
		   }, "editButton").startup();
		   
		   console.log("Add the Close Button");
		   closeButton = new Button({
		       label: "Close",
		       onClick: function(){
			   dynDialog.hide();
		       }
		   }, "editCloseButton").startup();

		   console.log("Adding the 'zen-control' class to certain nodes of the Buttons to allow click events to pass to them");
		   domClass.add("editButton_label", "zen-control");
		   domClass.add("editCloseButton_label", "zen-control");
		   query("input").forEach(function(node) {
		       domClass.add(node, "zen-control");
		   });

		   acceptButton = dijit.byId("editButton"), editCloseButton = dijit.byId("editCloseButton");
		   console.group("acceptButton");
		   console.dir(acceptButton);
		   console.groupEnd();
		   console.group("editCloseButton");
		   console.dir(editCloseButton);
		   console.groupEnd();
	       }
	   };
	   
	   ile.destroyDialog = function() {
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
	   
	   ile.showDialog = function(node) {
	       console.log("Showing the Dialog");
	       console.group("nodes for which to show dynamic Dialog");
	       console.dir(node);
	       console.dir(node.parentNode);
	       console.dir(node.parentNode.parentNode);
	       console.groupEnd();
	       clickedOnNode = node;
	       dom.byId("dialogImageURL").value = node.src;
	       dynDialog.show();
	   };
	  
	   return ile;
       });
