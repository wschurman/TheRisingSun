// Strings
var FROM_LABEL = 'Starting Point';
var TO_LABEL = 'Destination';
var DEPART_LABEL = 'Departure Time';
var SUBMIT_TEXT = 'Find Route!';

// Destinations - maybe change to Ajax call in the future
var destinations = [];
destinations[0]=Titanium.UI.createPickerRow({title:'North Campus'});
destinations[1]=Titanium.UI.createPickerRow({title:'Central Campus'});
destinations[2]=Titanium.UI.createPickerRow({title:'Collegetown'});
destinations[3]=Titanium.UI.createPickerRow({title:'Downtown'});
destinations[4]=Titanium.UI.createPickerRow({title:'Pyramid Mall'});

// Heights and widths
var ELEMENT_HEIGHT = 55;
var LABEL_WIDTH = 165;
var TEXT_FIELD_WIDTH = 250;
var SUBMIT_WIDTH = 450;

// The entire window (not including the tab)
var win = Titanium.UI.currentWindow;

// Labels
var fromLabel = null;
var toLabel = null;
var departureLabel = null;

// Text Fields
var fromField = null;

// Pickers
var toField = null;
var departureField = null;

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

toField = Titanium.UI.createPicker({
	color:'#000',
	top:80,
	left:146,
	width:300,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
toField.add(destinations);

departureLabel = Titanium.UI.createLabel({
	color:'#000000',
	top:155,
	left:150,
	width:'auto',
	width:LABEL_WIDTH,
	height:ELEMENT_HEIGHT,
	text:DEPART_LABEL
});

departureField = Titanium.UI.createPicker({
	color:'#000',
	top:205,
	left:111,
	type:Titanium.UI.PICKER_TYPE_TIME,
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
win.add(departureLabel);
win.add(departureField);
win.add(submitButton);

// Add functionality
var findRoute = function() {
	// Make Ajax call to grab data; for now, we just have dummy JSON
	// var data = $.ajax(startingPoint : userStartingPoint, destination : userDestination)...
	var data = {
		startingPoint :
			{ latitude : 37.390749, longitude : -122.081651, name : 'Mountain View Headquarters'},
		destination :
			{ latitude : 37.511389, longitude : -122.208311, name : 'Random Destination'},
		directions :
			[
				'Walk .14 miles to Stop 1 and get on Route 14. It departs at 2:40 PM.',
				'Travel .80 miles to Stop 2 and get on Route 30. It departs at 3:30 PM.',
				'Travel .03 miles to Stop 3. This is the final stop. Walk from here to Random Destination.'
			]
	}
	
	getToField().blur();
	
	var w = Ti.UI.createWindow({
		title:"TCAT Route - Map",
		url:"textRoute.js",
		from:getFromField().value,
		to:getToField().value,
		data:data
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