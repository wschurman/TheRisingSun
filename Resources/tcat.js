// URL for AJAX
var AJAX_URL = "http://132.236.96.239/TCATServer/main";

// Styling
FONT_FAMILY = 'Droid Sans';
FONT_SIZE = 20;

// Strings
var FROM_LABEL = 'Starting Point';
var TO_LABEL = 'Destination';
var DEPART_LABEL = 'Departure Time';
var SUBMIT_TEXT = 'Find Route!';

// Destinations - maybe change to Ajax call in the future
var destinations = [];
destinations[0]=Titanium.UI.createPickerRow({title:'Ag Quad'});
destinations[1]=Titanium.UI.createPickerRow({title:'Airport'});
destinations[2]=Titanium.UI.createPickerRow({title:'Arts Quad'});
destinations[3]=Titanium.UI.createPickerRow({title:'Central Campus'});
destinations[4]=Titanium.UI.createPickerRow({title:'Collegetown'});
destinations[5]=Titanium.UI.createPickerRow({title:'Downtown'});
destinations[6]=Titanium.UI.createPickerRow({title:'Engineering Quad'});
destinations[7]=Titanium.UI.createPickerRow({title:'Hasbrouck Apartments'});
destinations[8]=Titanium.UI.createPickerRow({title:'Ithaca College'});
destinations[9]=Titanium.UI.createPickerRow({title:'North Campus'});
destinations[10]=Titanium.UI.createPickerRow({title:'Pyramid Mall'});
destinations[11]=Titanium.UI.createPickerRow({title:'The Commons'});
destinations[12]=Titanium.UI.createPickerRow({title:'Wegmans'});
destinations[13]=Titanium.UI.createPickerRow({title:'West Campus'});

var annotationIndices = {
	'Agricultural Quad' : 0,
	'Airport' : 1,
	'Arts Quad' : 2,
	'Central Campus' : 3,
	'Collegetown' : 4,
	'Downtown' : 5,
	'Engineering Quad' : 6,
	'Hasbrouck Apartments' : 7,
	'Ithaca College' : 8,
	'North Campus' : 9,
	'Pyramid Mall' : 10,
	'The Commons' : 11,
	'Wegmans' : 12,
	'West Campus' : 13
};

var MAP_ANNOTATIONS = [
	Titanium.Map.createAnnotation({latitude:42.448712,longitude:-76.478700,title:'Agricultural Quad',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:1}), // Ag Quad
	Titanium.Map.createAnnotation({latitude:42.487606,longitude:-76.462226,title:'Airport',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:2}), // Airport
	Titanium.Map.createAnnotation({latitude:42.448953,longitude:-76.484499,title:'Arts Quad',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:3}), // Central Campus
	Titanium.Map.createAnnotation({latitude:42.447213,longitude:-76.483356,title:'Central Campus',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:4}), // Central Campus
	Titanium.Map.createAnnotation({latitude:42.442251,longitude:-76.485151,title:'Collegetown',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:5}), // Collegetown
	Titanium.Map.createAnnotation({latitude:42.439635,longitude:-76.497363,title:'Downtown',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:6}), // The Commons
	Titanium.Map.createAnnotation({latitude:42.444535,longitude:-76.483490,title:'Engineering Quad',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:7}), // The Commons
	Titanium.Map.createAnnotation({latitude:42.456204,longitude:-76.472526,title:'Hasbrouck Apartments',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:8}), // The Commons
	Titanium.Map.createAnnotation({latitude:42.421714,longitude:-76.497331,title:'Ithaca College',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:9}), // The Commons
	Titanium.Map.createAnnotation({latitude:42.455128,longitude:-76.478209,title:'North Campus',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:10}), // N. Campus
	Titanium.Map.createAnnotation({latitude:42.483001,longitude:-76.490378,title:'Pyramid Mall',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:11}), // Pyramid Mall
	Titanium.Map.createAnnotation({latitude:42.439635,longitude:-76.497363,title:'The Commons',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:12}), // The Commons
	Titanium.Map.createAnnotation({latitude:42.435208,longitude:-76.510549,title:'Wegmans',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:13}), // The Commons
	Titanium.Map.createAnnotation({latitude:42.447417,longitude:-76.488297,title:'West Campus',subtitle:'Ithaca, NY',pincolor:Titanium.Map.ANNOTATION_GREEN,animate:true,myid:14}) // The Commons
];

// Heights and widths
var FROM_LABEL_TOP = 17;
var FROM_FIELD_TOP = 20;
var TO_LABEL_TOP = 83;
var TO_FIELD_TOP = 80;
var ELEMENT_HEIGHT = 55;
var LABEL_WIDTH = 165;
var TEXT_FIELD_WIDTH = 250;
var SUBMIT_WIDTH = 450;

// Positioning of elements from the top
DEPARTURE_LABEL_TOP = 155;
DEPARTURE_FIELD_TOP = 205;

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
	font:{fontFamily:FONT_FAMILY, fontSize:FONT_SIZE},
	top:FROM_LABEL_TOP,
	left:10,
	width:LABEL_WIDTH,
	height:ELEMENT_HEIGHT,
	text:FROM_LABEL
});

fromField = Titanium.UI.createTextField({
	color:'#000',
	font:{fontFamily:FONT_FAMILY, fontSize:FONT_SIZE},
	top:FROM_FIELD_TOP,
	left:150,
	width:TEXT_FIELD_WIDTH,
	height:ELEMENT_HEIGHT,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

toLabel = Titanium.UI.createLabel({
	color:'#000000',
	font:{fontFamily:FONT_FAMILY, fontSize:FONT_SIZE},
	top:TO_LABEL_TOP,
	left:10,
	width:LABEL_WIDTH,
	height:ELEMENT_HEIGHT,
	text:TO_LABEL
});

toField = Titanium.UI.createPicker({
	color:'#000',
	font:{fontFamily:FONT_FAMILY, fontSize:FONT_SIZE},
	top:TO_FIELD_TOP,
	left:146,
	width:300,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
});
toField.add(destinations);

departureLabel = Titanium.UI.createLabel({
	color:'#000000',
	font:{fontFamily:FONT_FAMILY, fontSize:FONT_SIZE},
	top:DEPARTURE_LABEL_TOP,
	left:150,
	width:'auto',
	width:LABEL_WIDTH,
	height:ELEMENT_HEIGHT,
	text:DEPART_LABEL
});

departureField = Titanium.UI.createPicker({
	color:'#000',
	font:{fontFamily:FONT_FAMILY, fontSize:FONT_SIZE},
	top:DEPARTURE_FIELD_TOP,
	left:111,
	type:Titanium.UI.PICKER_TYPE_TIME,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

submitButton = Titanium.UI.createButton({
	font:{fontFamily:FONT_FAMILY, fontSize:FONT_SIZE},
	width:SUBMIT_WIDTH,
	height:55,
	bottom:10,
	enabled:true,
	visible:true,
	title:SUBMIT_TEXT,
});

var mapView = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	region:{latitude:42.445, longitude:-76.485, latitudeDelta:0.015, longitudeDelta:0.015},
	animate:true,
	regionFit:true,
	top:425,
	height:200,
	width:400,
	annotations:MAP_ANNOTATIONS
});

toField.addEventListener('change', function() {
	mapView.selectAnnotation(MAP_ANNOTATIONS[annotationIndices[toField.getSelectedRow(0)]]);
});

mapView.selectAnnotation(MAP_ANNOTATIONS[0]);

// Add all of our built-up elements
var searchBar = Titanium.UI.createSearchBar({
	barColor:'#EEEEEE',
	showCancel:true,
	width:'auto',
	height:-460,
	visible:false,
	top:10,
	left:10,
	hintText:'Enter starting location!'
});

var searchData = [];

var searchResults = Titanium.UI.createTableView({
	data:searchData,
	visible:false,
	top:80,
	left:10,
	height:'auto',
	width:'auto'
});

win.add(searchBar);
win.add(searchResults);
win.add(fromLabel);
win.add(fromField);
win.add(toLabel);
win.add(toField);
win.add(departureLabel);
win.add(departureField);
win.add(mapView);
win.add(submitButton);

function displaySearchBar(show) {
	searchBar.visible = show;
	searchResults.visible = show;
}

function displaySplashScreen(show) {
	fromLabel.visible = show;
	fromField.visible = show;
	toLabel.visible = show;
	toField.visible = show;
	departureLabel.visible = show;
	departureField.visible = show;
	mapView.visible = show;
	submitButton.visible = show;
}

searchBar.addEventListener('change',
	function() {
		if (searchBar.value.length >= 2) {
			var searchParam = searchBar.value;
			
			var searchXHR = Titanium.Network.createHTTPClient();
			searchXHR.onload = function() {
				if (this.status != 200) {
					var alertDialog = Titanium.UI.createAlertDialog({
					    title: 'Oh noes!',
					    message: "Trouble connecting to the server. =(",
					});
					alertDialog.show();
				} else {				
				    var json = JSON.parse(this.responseText);
					
					searchData = [];
	
					for (var i = 0; i < json.possible_searches.length; i++) {
						var possibleSearch = json.possible_searches[i];
						var newRow = Titanium.UI.createTableViewRow({
							height:55,
							title:possibleSearch
						}); 
						newRow.addEventListener('click',
							function() {
								displaySearchBar(false);
								displaySplashScreen(true);
								fromField.value = newRow.title;
							}
						);
						searchData.push(newRow);	
					}
					
					searchResults.data = searchData;
				}
			}; 
			var searchParams = "?search=" + searchParam
			var searchURL = AJAX_URL + searchParams;
			searchXHR.open("GET", searchURL);
			searchXHR.send();		
		}	
	}
);

searchBar.addEventListener('return',
	function() {
		displaySearchBar(false);
		displaySplashScreen(true);
		fromField.value = searchBar.value;
		fromField.focus();		
	}
);

fromField.addEventListener('change',
	function() {
		if (searchBar.value.length == 0) {
			displaySearchBar(true);
			displaySplashScreen(false);
			searchBar.value = fromField.value;
		}
		if (!searchBar.visible) {
			searchBar.value = '';
		}
	}
);

// Add functionality
var findRoute = function() {
  	var fromParam = getFromField().value;
	var toParam = getToField().getSelectedRow(0);
	var dateParam = departureField.value;
	
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		getToField().blur();
		
	    var json = JSON.parse(this.responseText);
	
		if (json == null || json.error) {
			var alertDialog = Titanium.UI.createAlertDialog({
			    title: 'Oh noes!',
			    message: json.error,
			});
			alertDialog.show();
			getToField().focus();
		} else {
			var w = Ti.UI.createWindow({
				title:"TCAT Route - Directions",
				url:"textRoute.js",
				from:fromParam,
				to:toParam,
				data:json
			});
			Titanium.UI.currentTab.open(w,{animated:true});
		}
	}; 
	var params = "?from=" + fromParam + "&to=" + toParam + "&date=" + dateParam;
	var completeURL = AJAX_URL + params;
	xhr.open("GET", completeURL);
	xhr.send();
};

var nextBox = function() {
	getFromField().blur();
	getToField().focus();
};

setFromFieldAction('return', nextBox);
setToFieldAction('return', findRoute);
setSubmitButtonAction('click', findRoute);