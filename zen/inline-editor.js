define(["dojo/mouse", "dojo/dom", "dijit/Dialog", "dijit/form/Button", "dojo/dom-construct", "dojo/on", "dojo/dom-class", "dojo/query"],

       function(mouse, dom, Dialog, Button, domConstruct, on, domClass, query) {
	   ile = function() {};
	   var dynDialog, editor, acceptButton, closeButton, clickedOnNode;

	   console.log("Defining docEventHandler to use the capture phase of event processing (but not attaching it yet)");
	   ile.docEventHandler = function(event) {
	       var event = event || window.event;
	       var target = event.target || event.srcElement;
	       console.log("Doc click on " + target + ", with ID " +
			   target.id + ", with target.className '" + target.className + "'");
	       if (domClass.contains(target, "demo-pic-img")) {
		   ile.showDialog(target);
	       }
	       if (!domClass.contains(target, "zen-control")) {
		   event.cancelBubble = true; // Don't let the event bubble up.
		   event.stopImmediatePropagation(); // Works even in the capture phase.
	       }
	   };

	   ile.textNodeToText = function(textNode) {
	       return (textNode.textContent ? textNode.textContent : textNode.innerText);
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
			   newVal = dom.byId("dialogImageURL").value;
			   console.log("Setting image source to " + newVal);
			   clickedOnNode.src = newVal;
			   newVal = dom.byId("dialogFigureCaption").value;
			   clickedOnNode.parentNode.childNodes[3].textContent = newVal;
			   newVal = dom.byId("dialogSubtext").value;
			   //dom.byId('pic-slot-1').childNodes[2].textContent
			   dom.byId('pic-slot-1').childNodes[2].textContent = newVal;
			   //clickedOnNode.parentNode.childNodes[2] = newVal;
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
	       alert("This Zen-enabled web page is now in Edit Mode.");
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
	       var textNode, subtext, figureCaption;
	       console.log("Showing the Dialog");
	       console.group("editable nodes of the clicked-on demo-pic-slot");
	       console.dir(node);
	       console.dir(node.parentNode);
	       console.dir(node.parentNode.parentNode);
	       console.groupEnd();
	       clickedOnNode = node;
	       dom.byId("dialogImageURL").value = node.src;
	       //dom.byId("dialogFigureCaption").value = node.parentNode.innerText;
	       textNode = node.parentNode.parentNode.childNodes[2];
	       figureCaption = ile.textNodeToText(node.parentNode.childNodes[3]);
	       dom.byId("dialogFigureCaption").value = figureCaption;
	       subtext = textNode.textContent ? textNode.textContent : textNode.innerText;
	       dom.byId("dialogSubtext").value = subtext.trim();
	       dynDialog.show();
	   };
	  
	   return ile;
       });
