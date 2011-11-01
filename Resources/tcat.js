// Strings
var FROM_LABEL = 'Starting Point';
var TO_LABEL = 'Destination';
var SUBMIT_TEXT = 'Find Route!';

// Heights and widths
var ELEMENT_HEIGHT = 55;
var LABEL_WIDTH = 150;
var TEXT_FIELD_WIDTH = 250;
var SUBMIT_WIDTH = 450;

// The entire window (not including the tab)
var win = Titanium.UI.currentWindow;

// Labels
var fromLabel = null;
var toLabel = null;

// Text Fields
var fromField = null;
var toField = null;

// Submit button
var submitButton = null;

// Getters
var getFromField = function() { return fromField; };
var getToField = function() { return toField; };
var getSubmitButton = function() { return submitButton; };

// Set actions
var setFromFieldAction = function(event, action) {
	fromField.addEventListener(event, action);
};

var setToFieldAction = function(event, action) {
	toField.addEventListener(event, action);
};

var setSubmitButtonAction = function(event, action) {
	submitButton.addEventListener(event, action);
};

// Build the page

fromLabel = Titanium.UI.createLabel({
	color:'#000000',
	top:20,
	left:10,
	width:LABEL_WIDTH,
	height:ELEMENT_HEIGHT,
	text:FROM_LABEL
});

fromField = Titanium.UI.createTextField({
	color:'#000',
	top:20,
	left:150,
	width:TEXT_FIELD_WIDTH,
	height:ELEMENT_HEIGHT,
	hintText:'Start',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

toLabel = Titanium.UI.createLabel({
	color:'#000000',
	top:80,
	left:10,
	width:LABEL_WIDTH,
	height:ELEMENT_HEIGHT,
	text:TO_LABEL
});

toField = Titanium.UI.createTextField({
	color:'#000',
	top:80,
	left:150,
	width:TEXT_FIELD_WIDTH,
	height:ELEMENT_HEIGHT,
	hintText:'End',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

submitButton = Titanium.UI.createButton({
	width:SUBMIT_WIDTH,
	height:55,
	bottom:10,
	enabled:true,
	visible:true,
	title:SUBMIT_TEXT,
});

// Add all of our built-up elements
win.add(fromLabel);
win.add(fromField);
win.add(toLabel);
win.add(toField);
win.add(submitButton);


// Add functionality
var findRoute = function() {
	getToField().blur();
	
	var w = Ti.UI.createWindow({
		title:"TCAT Route - Map",
		url:"../mapRoute.js",
		from:getFromField().value,
		to:getToField().value
	});
	Titanium.UI.currentTab.open(w,{animated:true});
};

var nextBox = function() {
	getFromField().blur();
	getToField().focus();
};

setFromFieldAction('return', nextBox);
setToFieldAction('return', findRoute);
setSubmitButtonAction('click', findRoute);