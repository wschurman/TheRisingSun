/*var win = Titanium.UI.currentWindow;

var mountainView = Titanium.Map.createAnnotation({
    latitude:33.390749,
    longitude:-84.081651,
    title:"Appcelerator Headquarters",
    subtitle:'Mountain View, CA',
   // pincolor:Titanium.Map.ANNOTATION_RED,
    image:'images/map-pin.png',
    animate:true,
    leftButton: 'images/navigation-down-button.png',
    myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
});
 
var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:33.74511, longitude:-84.38993, 
            latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:true,
    annotations:[mountainView]
});
 
win.add(mapview);*/



var win = Titanium.UI.currentWindow;

var isAndroid = false;
if (Titanium.Platform.name == 'android') {
	isAndroid = true;
}

var url = "http://wschurman.com/supports/test_restaurants.php";

var mapview = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	region:{latitude:42.441131, longitude:-76.491966, latitudeDelta:0.05, longitudeDelta:0.05},
	animate:true,
	regionFit:true,
	userLocation:true
});

win.add(mapview);

var annotations = [];

var json, restaurants, restaurant, i, annotation, titleLabel, contentLabel;
 
var xhr = Ti.Network.createHTTPClient({
    onload: function() {
    // Ti.API.debug(this.responseText);
 
	    json = JSON.parse(this.responseText);
	    for (i = 0; i < json.restaurants.length; i++) {
	        restaurant = json.restaurants[i];
	        annotation = Ti.Map.createAnnotation({
	        	latitude:restaurant.latitude,
				longitude:restaurant.longitude,
				title:restaurant.name,
				subtitle:restaurant.url,
				pincolor:Titanium.Map.ANNOTATION_RED,
				//pinImage: 'images/map-pin.png',
				leftButton: "images/map-pin.png",
				//pinImage: (isAndroid) ? "images/map-pin.png" : "",
				//leftButton: 'images/tasks_off.png',
				raw: restaurant,
				animate:true
	        });
	        if(restaurant.avg_rating == 1){
				annotation.rightButton = 'one';
			}
			else if(restaurant.avg_rating == 2){
				annotation.rightButton = 'two';
			}
			else if(restaurant.avg_rating == 3){
				annotation.rightButton = 'three';
			}
			else if(restaurant.avg_rating == 4){
				annotation.rightButton = 'four';
			}
			else if(restaurant.avg_rating == 5){
				annotation.rightButton = 'five';
			}
	        annotations.push(annotation);
	        if (isAndroid) {
	        	mapview.addAnnotation(annotation);
	        }
	    }
		if (!isAndroid) mapview.addAnnotations(annotations);
	},
    onerror: function(e) {
    	Ti.API.debug("STATUS: " + this.status);
    	Ti.API.debug("TEXT:   " + this.responseText);
    	Ti.API.debug("ERROR:  " + e.error);
    	alert('There was an error retrieving the remote data. Try again.');
    },
    timeout:5000
});
 
xhr.open("GET", url);
xhr.send();

mapview.addEventListener('click',function(evt)
{

	// map event properties
	var annotation = evt.annotation;
	var title = evt.title;
	var clickSource = evt.clicksource;
	
	if (evt.clicksource == 'rightButton' || 
		(isAndroid && 
			(evt.clicksource == 'annotation' ||
			 evt.clicksource == 'title'))) {
		var w = Ti.UI.createWindow({
			title:annotation.raw.name,
			url:"restaurant.js",
			data:annotation.raw
		});
		Titanium.UI.currentTab.open(w,{animated:true});
	}
	else if(evt.clicksource =='leftButton'){
		var w = Ti.UI.createWindow({
			title:annotation.raw.name + ' User Reviews',
			url:"restaurant.js",
			data:annotation.raw
		});
	}
	else if(evt.clicksource =='subtitle'){
		var w = Ti.UI.createWindow({
			title:annotation.raw.name,
			url:"restaurant.js",
			data:annotation.raw
		});
	}
	
});