// Grab the two points of interest and display them on the map
// On the map, show a button that allows the user to switch to text view
// On the text view, show a button that allows the user to switch to map view

var win = Titanium.UI.currentWindow;

var userStartingPoint = win.from;
var userDestination = win.to;
var data = win.data;

var isAndroid = false;
if (Titanium.Platform.name == 'android') {
	isAndroid = true;
}

var mapStartingPoint = Titanium.Map.createAnnotation({
	latitude:data.startingPoint.latitude,
	longitude:data.startingPoint.longitude,
	title:data.startingPoint.name,
	subtitle:'Starting Point',
	pincolor: isAndroid ? "orange" : Titanium.Map.ANNOTATION_RED,
	animate:true,
	myid:1
});

var mapDestination = Titanium.Map.createAnnotation({
	latitude:data.destination.latitude,
	longitude:data.destination.longitude,
	title:data.destination.name,
	subtitle:'Destination',
	pincolor:Titanium.Map.ANNOTATION_GREEN,
	animate:true,
	myid:2
});

// Create the map
var mapview = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	region:{latitude:data.startingPoint.latitude, longitude:data.startingPoint.longitude, latitudeDelta:0.4, longitudeDelta:0.4},
	animate:true,
	regionFit:true,
	userLocation:true,
	annotations:[mapStartingPoint, mapDestination]
});

// Create the route - iOS only!
if (!isAndroid) {
	mapview.addRoute({
	    name: 'myroute',
	    width: 4,
	    color: '#f00',
	    points: [
	        {latitude:33.74511, longitude:-84.38993},
	        {latitude:33.8, longitude:-84.3},
	        {latitude:33.85, longitude:-84.25}
	    ]
	});
}

// Create the link to the textual directions
var getTextDirections = Titanium.UI.createButton({
	width:450,
	height:55,
	bottom:10,
	enabled:true,
	visible:true,
	title:'View Directions in Text',
});

// Add functionality to link
getTextDirections.addEventListener('click', function() {	
	var w = Ti.UI.createWindow({
		title:"TCAT Route - Map",
		url:"textRoute.js",
		from:userStartingPoint,
		to:userDestination,
		data:data
	});
	Titanium.UI.currentTab.open(w,{animated:true});
});

mapview.selectAnnotation(mapStartingPoint);
win.add(mapview);
win.add(getTextDirections);
