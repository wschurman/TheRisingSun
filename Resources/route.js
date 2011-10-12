var win = Titanium.UI.currentWindow;

var to = win.to;
var from = win.from;

var isAndroid = false;
if (Titanium.Platform.name == 'android') {
	isAndroid = true;
}

//
// CREATE ANNOTATIONS
//
var mountainView = Titanium.Map.createAnnotation({
	latitude:37.390749,
	longitude:-122.081651,
	title:"Appcelerator Headquarters",
	subtitle:'Mountain View, CA',
	pincolor: isAndroid ? "orange" : Titanium.Map.ANNOTATION_RED,
	animate:true,
	leftButton: '../images/appcelerator_small.png',
	myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
});

var apple = Titanium.Map.createAnnotation({
	latitude:37.33168900,
	longitude:-122.03073100,
	title:"Steve Jobs",
	subtitle:'Cupertino, CA',
	pincolor:Titanium.Map.ANNOTATION_GREEN,
	animate:true,
	rightButton: '../images/apple_logo.jpg',
	myid:2 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
});

var atlantaParams = {
		latitude:33.74511,
		longitude:-84.38993,
		title:"Atlanta, GA",
		subtitle:'Atlanta Braves Stadium\nfoo',
		animate:true,
		leftButton:'../images/atlanta.jpg',
		rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
		myid:3 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
	};

if (!isAndroid) {
	atlantaParams.pincolor = Titanium.Map.ANNOTATION_PURPLE;
} else {
	atlantaParams.pinImage = "../images/map-pin.png";
}
var atlanta = Titanium.Map.createAnnotation(atlantaParams);

//
// PRE-DEFINED REGIONS
//
var regionAtlanta = {latitude:33.74511,longitude:-84.38993,animate:true,latitudeDelta:0.04, longitudeDelta:0.04};
var regionSV = {latitude:37.337681,longitude:-122.038193,animate:true,latitudeDelta:0.04, longitudeDelta:0.04};

//
// CREATE MAP VIEW
//
var mapview = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	region:{latitude:33.74511, longitude:-84.38993, latitudeDelta:0.5, longitudeDelta:0.5},
	animate:true,
	regionFit:true,
	userLocation:true,
	annotations:[atlanta,apple]
});

if (!isAndroid) {
	mapview.addAnnotation(atlanta);
}
mapview.selectAnnotation(atlanta);
win.add(mapview);
