
var win = Titanium.UI.currentWindow;

var url = "http://wschurman.com/supports/test_sun.php";

var table = Ti.UI.createTableView();
var tableData = [];
var json, articles, article, i, row, titleLabel, contentLabel;
 
var xhr = Ti.Network.createHTTPClient({
    onload: function() {
    // Ti.API.debug(this.responseText);
 
	    json = JSON.parse(this.responseText);
	    for (i = 0; i < json.articles.length; i++) {
	        article = json.articles[i];
	        row = Ti.UI.createTableViewRow({
	            height:80,
	            hasChild:true,
	            hasDetail:(i < 2)
	        });
	        titleLabel = Ti.UI.createLabel({
	            text: article.title,
	            font:{
	                fontSize:'18dp',
	            	fontWeight:'bold'
	        	},
	        	left:72,
				top:-25,
				bottom:5,
				right:5,
	        	color:'#000',
	        	touchEnabled:false
	        });
	        contentLabel = Ti.UI.createLabel({
		        text: article.content.substr(0, 100),
		        font:{
		            fontSize:'16dp'
		        },
		        left:72,
				top:30,
				bottom:5,
				right:5,
		        color:'#333',
		        touchEnabled:false
	        });
	 		var img;
	 		var media = article.thumb;
			if (Titanium.Platform.name == 'android') 
			{
				// iphone moved to a single image property - android needs to do the same
				img = Ti.UI.createImageView({
					image:media,
					left:5,
					height:60,
					width:60
				});

			}
			else
			{
				img = Ti.UI.createImageView({
					image:media,
					left:5,
					height:60,
					width:60
				});
				
			}
	        row.add(titleLabel);
	        row.add(contentLabel);
	        row.add(img);
	        tableData.push(row);
	        row.url = article.permalink;
	        row.raw = article;
	    }
 		table.setData(tableData);
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
 
win.add(table);

table.addEventListener('click',function(e) {
	var w = Ti.UI.createWindow({
		title:e.row.raw.title,
		url:"article.js",
		data:e.row.raw
	});
	//var wb = Ti.UI.createWebView({url:e.row.raw.permalink});
	//w.add(wb);
	Titanium.UI.currentTab.open(w,{animated:true});
});
