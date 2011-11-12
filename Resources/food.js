

var secondary_layout_is_displayed = false;


Ti.UI.currentWindow.addEventListener('android:back', function() { 

	toast.show();
	
	var w = Ti.UI.createWindow({
			title:"test",
			url:"app.js",
			backgroundColor: '#fff',
			data:"none"
		});
		Titanium.UI.currentTab.open(w,{animated:true});
		
});

var win = Ti.UI.currentWindow;
var b = Titanium.UI.createButton({title:'title'});
b.addEventListener('click', function()
{
    alert('heelo');
});
win.leftNavButton = b;



cachedImageView = function(imageDirectoryName, url, imageViewObject)
	{
	// Grab the filename
	var filename = url.split('/');
	filename = filename[filename.length - 1];
	// Try and get the file that has been previously cached
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName, filename);
	
	if (file.exists()) {
	// If it has been cached, assign the local asset path to the image view object.
	imageViewObject.image = file.nativePath;
	} else {
	// If it hasn't been cached, grab the directory it will be stored in.
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName);
	if (!g.exists()) {
	// If the directory doesn't exist, make it
	g.createDirectory();
	};
	
	// Create the HTTP client to download the asset.
	var xhr = Ti.Network.createHTTPClient();
	
	xhr.onload = function() {
	if (xhr.status == 200) {
	// On successful load, take that image file we tried to grab before and
	// save the remote image data to it.
	file.write(xhr.responseData);
	// Assign the local asset path to the image view object.
	imageViewObject.image = file.nativePath;
	};
	};
	
	// Issuing a GET request to the remote URL
	xhr.open('GET', url);
	// Finally, sending the request out.
	xhr.send();
	};
};

var toast = Titanium.UI.createNotification({
    duration: 2000,
    message: "Hi, I'm a toast!"
});

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
				//pincolor:Titanium.Map.ANNOTATION_RED,
				//image:'images/map-pin.png',
				raw: restaurant,
				animate:true
	        });
	        
	        if (!isAndroid) {
				annotation.pincolor = Titanium.Map.ANNOTATION_PURPLE;
			} else {
				//annotation.pinImage = "/images/map-pin.png";
				cachedImageView("/images/map-pin2.png", 'http://static.sna.pr/live/gfx/snapmappin-public.png', annotation);
			}

		 
		   //annotation.pincolor = Titanium.Map.ANNOTATION_RED;
	        
	        if(restaurant.avg_rating == 1){
				annotation.rightButton = 'images/1_starsc.png';
			}
			else if(restaurant.avg_rating == 2){
				annotation.rightButton = 'images/2_starsc.png';
			}
			else if(restaurant.avg_rating == 3){
				annotation.rightButton = 'images/3_starsc.png';
			}
			else if(restaurant.avg_rating == 4){
				annotation.rightButton = 'images/4_starsc.png';
			}
			else if(restaurant.avg_rating == 5){
				annotation.rightButton = 'images/5_starsc.png';
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
	
	if (/*(isAndroid && */
			(evt.clicksource == 'annotation' ||
			 evt.clicksource == 'title')/*)*/) {
			 	
        
        var w = Ti.UI.createWindow({
			title:annotation.raw.name,
			url:"restaurantArticle.js",
			backgroundColor: '#fff',
			data:annotation.raw
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
		secondary_layout_is_displayed = true;
		
		var wview = Titanium.UI.createWebView({
			url:annotation.raw.url,
			data:annotation.raw.url
		})
		
		win.add(wview);
		wview.show();
		
		
	}
	
});