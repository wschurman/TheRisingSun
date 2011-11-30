var secondary_layout_is_displayed = false;

var win = Ti.UI.currentWindow;

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

var isAndroid = false;
if (Titanium.Platform.name == 'android') {
	isAndroid = true;
}

var url = "http://cornellsun.com/services/rest/";

var table = Ti.UI.createTableView();

function viewReview(uri, name) {
	return function() {
		var w = Ti.UI.createWindow({
			title: name
		});
		var m = Titanium.Map.createView({
			mapType: Titanium.Map.STANDARD_TYPE,
			region:{latitude:42.441131, longitude:-76.491966, latitudeDelta:0.01, longitudeDelta:0.01},
			animate:true,
			regionFit:true,
			userLocation:true,
			height: "50%",
			top: 0
		});
		
		w.add(m);
		
		Ti.API.debug('HEIGHT: '+m.size.height);
		
		var s = Titanium.UI.createScrollView({
			contentWidth:"100%",
			contentHeight:"auto",
			top: "50%",
			width: "100%",
			height: "50%",
			backgroundColor: "#FFFFFF",
			showVerticalScrollIndicator:true,
			showHorizontalScrollIndicator:false,
		});
		
		w.add(s);
		
		var annotations = [];

		var json, restaurants, restaurant, i, annotation, titleLabel, contentLabel;
		
		var review_xhr = Ti.Network.createHTTPClient({
		    onload: function() {
	    		json = JSON.parse(this.responseText);
	        	Ti.API.debug("ABC: "+this.responseText);
	        	var review_title = Titanium.UI.createLabel({
	        		id:'article_title',
	        		text: json.title,
	        		font: {fontSize: 20},
	        		top: 0,
	        		height: 'auto',
	        		width: Titanium.Platform.displayCaps.platformWidth - 20,
	        		color: "#383838"
	        	});
	        	s.add(review_title);
	        	
	        	var review_author = Titanium.UI.createLabel({
	        		id: 'article_author',
	        		text: 'By '+json.name,
	        		font: {fontSize: 12},
	        		top: review_title.size.height+2,
	        		left: 20,
	        		height: 'auto',
	        		width: Titanium.Platform.displayCaps.platformWidth - 20,
	        		color: '#666666'
	        	});
	        	s.add(review_author);
	        	
	        	var review_text = Titanium.UI.createLabel({
					id:'article_content',
					text: json.body.replace( /<\/p>/g, '\n' ).replace( /<[^>]+>/g, '' ).replace( /&nbsp;/g, ' '),
					font: {fontSize: (isAndroid) ? 21 : 17},
					top: review_title.size.height+20,
					height:'auto',
					width:Titanium.Platform.displayCaps.platformWidth - 20,
					color:"#383838"
				});
	        	
	        	s.add(review_text);
			},
    		onerror: function(e) {
    			Ti.API.debug("STATUS: " + this.status);
    			Ti.API.debug("TEXT:   " + this.responseText);
    			Ti.API.debug("ERROR:  " + e.error);
    			alert('There was an error retrieving the remote data. Try again.');
    		},
    		timeout:5000
		});

		var xhr = Ti.Network.createHTTPClient({
		    onload: function() {
	    		json = JSON.parse(this.responseText);
	        	annotation = Ti.Map.createAnnotation({
	        		latitude:json.location.latitude,
					longitude:json.location.longitude,
					title:json.title,
					raw: json,
					animate:true
	        	});
	        	m.region = {latitude: json.location.latitude, longitude: json.location.longitude, latitudeDelta:0.01, longitudeDelta:0.01};
	        
	        	if (!isAndroid) {
					annotation.pincolor = Titanium.Map.ANNOTATION_PURPLE;
				} else {
					//annotation.pinImage = "/images/map-pin.png";
					cachedImageView("/images/map-pin2.png", 'http://static.sna.pr/live/gfx/snapmappin-public.png', annotation);
				}
			  	annotations.push(annotation);
	        	if (isAndroid) {
	        		m.addAnnotation(annotation);
	        	} else {
	        		m.addAnnotations(annotations);
	        	}
	        	
	        	Ti.API.debug("NID: "+json.field_related_story[0].nid);
	        	review_xhr.open("GET", "http://cornellsun.com/services/rest/node/"+json.field_related_story[0].nid+".json");
				review_xhr.send();
			},
    		onerror: function(e) {
    			Ti.API.debug("STATUS: " + this.status);
    			Ti.API.debug("TEXT:   " + this.responseText);
    			Ti.API.debug("ERROR:  " + e.error);
    			alert('There was an error retrieving the remote data. Try again.');
    		},
    		timeout:5000
		});
 
		xhr.open("GET", uri+".json");
		xhr.send();
		
		Ti.UI.currentTab.open(w,{animated: true});
	}
}

function loadRestaurants() {
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	Ti.API.debug(this.responseText);
		    json = JSON.parse(this.responseText);
		    refreshTable(json);
		},
	    onerror: function(e) {
	    	Ti.API.debug("STATUS: " + this.status);
	    	Ti.API.debug("TEXT:   " + this.responseText);
	    	Ti.API.debug("ERROR:  " + e.error);
	    	alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:15000
	});
	 
	xhr.open("GET", 'http://cornellsun.com/services/rest/node.json?type=dining_loc');
	xhr.send();
}

function refreshTable(json) {
	tableData = [];
	table.setData([]);
	for (var i = 0; i < json.length; i++) {
        restaurant = json[i];
        
        row = Ti.UI.createTableViewRow({
            height: (isAndroid) ? 40 : 45
        });
        
        hasImage = false;
        
        nameLabel = Ti.UI.createLabel({
            text: restaurant.title,
            font:{
                fontSize: 20
        	},
        	left: 10,
        	//top: 80,
        	//height:30,
        	height: 24,
        	//width: (hasImage) ? "70%" : "100%",
        	width: 'auto',
        	//top:(isAndroid) ? 10 : -30,
        	top: 10,
        	color: '#000',
        	touchEnabled: false
        });
        row.add(nameLabel);

		tableData.push(row);
		row.uri = restaurant.uri;
		row.raw = restaurant;
		
		row.addEventListener('click', viewReview(row.uri, row.raw.title));
    }
	table.setData(tableData);
}

loadRestaurants();
win.add(table);
