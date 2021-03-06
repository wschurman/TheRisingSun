/*
 * Controller for the TCAT route map view on iOS
 */

var win = Titanium.UI.currentWindow;
var isAndroid = (Titanium.Platform.name == 'android');

var userStartingPoint = win.from;
var userDestination = win.to;
var data = win.data;

var mapStartingPoint = Titanium.Map.createAnnotation({
	latitude:data.startingPoint.latitude,
	longitude:data.startingPoint.longitude,
	title:data.startingPoint.name,
	subtitle:'Starting Point',
	pincolor: isAndroid ? "orange" : Titanium.Map.ANNOTATION_GREEN,
	animate:true,
	myid:1
});

var mapDestination = Titanium.Map.createAnnotation({
	latitude:data.destination.latitude,
	longitude:data.destination.longitude,
	title:data.destination.name,
	subtitle:'Destination',
	pincolor:Titanium.Map.ANNOTATION_RED,
	animate:true,
	myid:2
});

var l = (parseFloat(data.startingPoint.latitude) + parseFloat(data.destination.latitude)) /2.0;
var ln = (parseFloat(data.startingPoint.longitude) + parseFloat(data.destination.longitude)) /2.0;
// Create the map
var mapview = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	region:{
		latitude:l,
		longitude:ln,
		latitudeDelta:Math.abs((parseFloat(data.startingPoint.latitude) - parseFloat(data.destination.latitude))),
		longitudeDelta:Math.abs((parseFloat(data.startingPoint.longitude) - parseFloat(data.destination.longitude)))
	},
	animate:true,
	regionFit:true,
	userLocation:true,
	//annotations:[mapStartingPoint, mapDestination]
});

var pointsArr = [];
var i;
for(i = 0; i < win.data.directions.length; i++) {
	var dir = win.data.directions[i];
	pointsArr.push({latitude:dir.latitude, longitude:dir.longitude});
	var annotation3 = Titanium.Map.createAnnotation({
			latitude: dir.latitude,
		    longitude: dir.longitude,
		    pincolor: Titanium.Map.ANNOTATION_GREEN,
		    image:"bpin.png",
		    title:"Step "+(i+1),
		    subtitle:dir.direction,
		    data: dir.direction,
		    animate: true,
		    myid: 3
	});
	mapview.addAnnotation(annotation3);
}

// Create the route - iOS only!
if (pointsArr.length > 0) {
	mapview.addRoute({
	    name: 'myroute',
	    width: 4,
	    color: '#8D8DFF',
	    points: pointsArr
	});
}

// Create the link to the textual directions
var listBtn = Titanium.UI.createButton({
	image:"images/sort.png"
});
listBtn.addEventListener('click',function()
{
	var w = Titanium.UI.createWindow({
		title:"TCAT Route - Text",
		url:"textRoute_ios.js",
		from:userStartingPoint,
		to:userDestination,
		data:data
	});
	var b = Titanium.UI.createButton({
		title:'Close',
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	w.setLeftNavButton(b);
	b.addEventListener('click',function()
	{
		w.close();
	});
	w.open({modal:true});
});

Titanium.UI.currentWindow.setRightNavButton(listBtn);

mapview.selectAnnotation(mapStartingPoint);
win.add(mapview);
