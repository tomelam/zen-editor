//FIXME: Replace the verbose code below with functions described at
// https://dojotoolkit.org/reference-guide/1.10/dojo/NodeList-traverse.html ,
// https://dojotoolkit.org/reference-guide/1.10/dojo/NodeList-manipulate.html , etc.
//FIXME: Better use Dojo's selector engines. See https://dojotoolkit.org/reference-guide/1.10/dojo/query.html .
//FIXME: Study JSONQuery for utility. See https://dojotoolkit.org/reference-guide/1.10/dojox/json/query.html .
//FIXME: Study JSONPath for utility. See https://dojotoolkit.org/api/?qs=1.10/dojox/jsonPath/ .
//FIXME: When, if ever, should we call the 'focus' method of the Dialog?
//FIXME: Consider using dijit/InlineEditBox. See https://dojotoolkit.org/reference-guide/1.10/dijit/InlineEditBox.html .

define(["dojo/mouse", "dojo/dom", "dijit/Dialog", "dijit/form/Button", "dojo/dom-construct", "dojo/on", "dojo/dom-class",
	"dojo/query", "dojo/_base/array", "dojo/NodeList-traverse"],

       function(mouse, dom, Dialog, Button, domConstruct, on, domClass, query, array) {
	   ile = function() {};
	   var zenPicSlotCount = 0, initialEditableStrings = [], changedStrings = [], callback,
	       dynDialog, editor, acceptButton, closeButton, clickedOnZenPicSlot;

	   console.log("Define docEventHandler to use the capture phase of event processing (but don't attach it yet)");
	   ile.docEventHandler = function(event) {
	       var event = event || window.event;
	       var target = event.target || event.srcElement;
	       console.log("Doc click on " + target + ", with ID " +
			   target.id + ", with target.className '" + target.className + "'");
	       //FIXME: Zen should not know about class demo-pic-img.
	       if (domClass.contains(target, "demo-pic-img")) {
		   ile.showDialog(target);
	       }
	       if (!domClass.contains(target, "zen-control")) {
		   event.cancelBubble = true; // Don't let the event bubble up.
		   event.stopImmediatePropagation(); // Works even in the capture phase.
	       }
	   };

	   ile.getTextNodeText = function(textNode) {
	       return (textNode.textContent ? textNode.textContent : textNode.innerText);
	   };

	   ile.setTextNodeText = function(textNode, text) {
	       if (textNode.textContent) {
		   textNode.textContent = text;
	       } else {
		   textNode.innerText = text;
	       }
	   };
	   
	   ile.dir = function(string, object) {
	       console.group(string);
	       array.forEach(object, function(item) { console.dir(item); });
	       console.groupEnd();
	   };

	   //FIXME: This function is probably too long. Consider breaking it up.
	   ile.createDialog = function(callback) {
	       callback = callback || function() { console.info("No callback defined"); }
	       console.info("Creating Dialog (and leaving it hidden)");

	       //FIXME: Handle all events, not just clicks.
	       console.log("Add docEventHandler to the document node to handle all clicks");
	       document.addEventListener('click', ile.docEventHandler, true);

	       console.log("Save the initial state of every editable string");
	       query(".zen-pic-slot").forEach(function(node) {
		   var values = {};
		   values.node = node;
		   values.src = node.childNodes[1].childNodes[1].src;
		   values.figcaption = node.childNodes[1].innerText;
		   values.subtext = ile.getTextNodeText(node.childNodes[2]);
		   initialEditableStrings[zenPicSlotCount] = values;
		   zenPicSlotCount += 1;
	       });
	       ile.dir("initial editable strings", [ initialEditableStrings ]);

	       if (!(dynDialog = dijit.byId("dynDialog"))) {
		   var tree, html = '<div id="editorDialog" style="display: none;">';
		   html += '<strong>Image URL</strong>';
		   html += '<textarea id="dialogImageURL" style="width: 90%" placeholder="enter text"></textarea>';
		   html += '<strong>Caption</strong>';
		   html += '<textarea id="dialogFigureCaption" style="width: 90%" placeholder="enter text"></textarea>';
		   html += '<strong>Subtext</strong>';
		   html += '<textarea id="dialogSubtext" style="width: 90%" placeholder="enter text"></textarea>';
		   html += '<br><div id="editButton"></div><div id="editCloseButton"></div>';
		   tree = domConstruct.toDom(html);
		   console.log("Construct and place the HTML elements for the Dialog");
		   domConstruct.place(tree, "editorDialogContainer");

		   console.log("Turn the HTML elements into a Dialog");
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
			   //FIXME: If the user provides an invalid URL, the Dialog cannot be opened again. Fix this!
			   var event = event || window.event;
			   var target = event.target || event.srcElement;
			   var changedStrings = {}, textNode;
			   console.info("Accept button clicked");
			   ile.dir("editable nodes of the clicked-on zen-pic-slot",
				   [ clickedOnImgNode,                             // img
				     clickedOnImgNode.parentNode,                  // figure
				     clickedOnImgNode.parentNode.parentNode ]);    // div
			   array.some(initialEditableStrings,
				      function(initialZenPicSlotStrings) {
					  ile.dir("initialZenPicSlotStrings", [ initialZenPicSlotStrings ]);
					  if (initialZenPicSlotStrings.node.childNodes[1].childNodes[1] ===
					      clickedOnImgNode) {
					      ile.dir("Initial strings in the clicked-on zen-pic-slot",
						      [ initialZenPicSlotStrings ]);
					      initialStrings = initialZenPicSlotStrings;
					      return true;
					  }
					  else {
					      console.error("Could not determine the target node");
					      return false;
					  }
				      });
			   ile.dir("clickedOnImgNode before change", [ clickedOnImgNode,
								       clickedOnImgNode.parentNode,
								       clickedOnImgNode.parentNode.parentNode ]);
			   newVal = dom.byId("dialogImageURL").value;
			   clickedOnImgNode.src = newVal;
			   newVal = dom.byId("dialogFigureCaption").value;
			   ile.setTextNodeText(clickedOnImgNode.parentNode.childNodes[3], newVal);
			   newVal = dom.byId("dialogSubtext").value;
			   console.debug("New subtext is " + newVal);
			   textNode = clickedOnImgNode.parentNode.parentNode.childNodes[2];
			   ile.setTextNodeText(textNode, newVal);

			   ile.dir("clickedOnImgNode after change", [ clickedOnImgNode,
								      clickedOnImgNode.parentNode,
								      clickedOnImgNode.parentNode.parentNode ]);
			   
			   console.debug("Find the strings that have been changed");
			   ile.dir("initialStrings", [ initialStrings ]);
			   changedStrings.node = clickedOnImgNode;
		       	   if (clickedOnImgNode.src != initialStrings.src) {
			       changedStrings.src = initialStrings.src;
			   }
			   string = ile.getTextNodeText(clickedOnImgNode.parentNode.childNodes[3]);
			   if (string != initialStrings.figcaption) {
			       changedStrings.figcaption = string;
			   }
			   console.debug("Here 2");
			   textNode = clickedOnImgNode.parentNode.parentNode.textContent;
			   string = ile.getTextNodeText(textNode);
			   if (string != initialStrings.subtext) {
			       changedStrings.subtext = string;
			   }
			   console.debug("Here 3");
			   ile.dir("changedStrings", [ changedStrings ]);

			   // Call the callback function here instead of in the closeDialog function because
			   // the user might want a fine-grained persistence mechanism. For example, he might
			   // not close the Dialog for a long time -- just watching the changes and getting
			   // everything perfect.
			   callback(changedStrings);
		       }
		   }, "editButton").startup();
		   
		   console.log("Add the Close Button");
		   closeButton = new Button({
		       label: "Close",
		       onClick: function(){
			   dynDialog.hide();
		       }
		   }, "editCloseButton").startup();

		   console.log("Add the 'zen-control' class to certain nodes of the Buttons to allow click events to");
		   console.log("pass to them");
		   domClass.add("editButton_label", "zen-control");
		   domClass.add("editCloseButton_label", "zen-control");
		   //FIXME: Looks like this query will return too many nodes.
		   query("input").forEach(function(node) {
		       domClass.add(node, "zen-control");
		   });

		   acceptButton = dijit.byId("editButton"), editCloseButton = dijit.byId("editCloseButton");
		   ile.dir("acceptButton", [ acceptButton ]);
		   ile.dir("editCloseButton", [ editCloseButton ]);
	       }
	       alert("This Zen-enabled web page is now in Edit Mode.");
	   };
	   
	   ile.destroyDialog = function() {
	       dynDialog = dijit.byId("dynDialog");
	       acceptButton = dijit.byId("editButton");
	       closeButton = dijit.byId("editCloseButton");
	       console.info("destroy Dialog");
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
	       console.log("Show the Dialog");
	       //ile.dir("editable nodes of the clicked-on zen-pic-slot",
	       //        [ node, node.parentNode, node.parentNode.parentNode ]);
	       dom.byId("dialogImageURL").value = node.src;
	       textNode = node.parentNode.parentNode.childNodes[2];
	       figureCaption = ile.getTextNodeText(node.parentNode.childNodes[3]);
	       dom.byId("dialogFigureCaption").value = figureCaption;
	       dom.byId("dialogSubtext").value = ile.getTextNodeText(textNode);
	       clickedOnImgNode = node; // Store a reference to the clicked-on img node.
	       dynDialog.show();
	   };
	  
	   return ile;
       });
