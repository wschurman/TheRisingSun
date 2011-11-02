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
				rightButton: 'images/map-pin.png',
				raw: restaurant,
				animate:true
	        });
	        /*
	        if(restaurant.avg_rating == 1){
				annotation.leftButton = 'images/1_stars.png';
			}
			else if(restaurant.avg_rating == 2){
				annotation.leftButton = 'images/2_stars.png';
			}
			else if(restaurant.avg_rating == 3){
				annotation.leftButton = 'images/3_stars.png';
			}
			else if(restaurant.avg_rating == 4){
				annotation.leftButton = 'images/map-pin2.png';
			}
			else if(restaurant.avg_rating == 5){
				annotation.leftButton = 'images/5_stars.png';
			}
			*/
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
	
	if ((isAndroid && 
			(evt.clicksource == 'annotation' ||
			 evt.clicksource == 'title'))) {
			 	var url = "http://wschurman.com/supports/test_sun.php";
		
		if (isAndroid) {
			h = 150;
			contentTopPosition = 40;
		} else {
			h = 110;
			contentTopPosition = 30;
		}
		
		var row = Ti.UI.createTableViewRow({
            height: h,
            //hasChild:true,
            //hasDetail:(i < 2) // for future unread icons
        });
        
        var view = Ti.UI.createView({
        	top:5,
        	left:5,
        	right:5,
        	bottom:5,
        	touchEnabled:false
        })
        
        row.add(view);
        row.url = 'google.com';
       // row.raw = article;
        
        var w = Ti.UI.createWindow({
			title:annotation.raw.name,
			url:"article.js",
			data:row.raw
		});
		
		Titanium.UI.currentTab.open(w,{animated:true});
	}
	else if(evt.clicksource =='rightButton'){
		var w = Ti.UI.createWindow({
			title:annotation.raw.name + ' User Reviews',
			url:"restaurant.js",
			data:annotation.raw
		});
		
		Titanium.UI.currentTab.open(w,{animated:true});
	}
	else if(evt.clicksource =='subtitle'){
		var w = Ti.UI.createWindow({
			title:annotation.raw.name,
			url:"restaurantURL.js",
			data:annotation.raw
		});
		
		Titanium.UI.currentTab.open(w,{animated:true});
	}
	
});