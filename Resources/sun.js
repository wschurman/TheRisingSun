
var win = Titanium.UI.currentWindow;

var isAndroid = false;
if (Titanium.Platform.name == 'android') {
	isAndroid = true;
}

var url = "http://wschurman.com/supports/test_sun.php";

var table = Ti.UI.createTableView();
var tableData = [];
var json, articles, article, i, row, view, titleLabel, contentLabel, h, c;

if (isAndroid) {
	h = 120;
} else {
	h = 80;
}

var xhr = Ti.Network.createHTTPClient({
    onload: function() {
    // Ti.API.debug(this.responseText);
 
	    json = JSON.parse(this.responseText);
	    for (i = 0; i < json.articles.length; i++) {
	        article = json.articles[i];
	        
	        row = Ti.UI.createTableViewRow({
	            height:h,
	            hasChild:true,
	            //hasDetail:(i < 2) // for future unread icons
	        });
	        
	        view = Ti.UI.createView({
	        	top:5,
	        	left:5,
	        	right:5,
	        	bottom:5,
	        	touchEnabled:false
	        })
	        
	        titleLabel = Ti.UI.createLabel({
	            text: article.title,
	            font:{
	                fontSize:'18dp',
	            	fontWeight:'bold'
	        	},
	        	left:72,
	        	top:(isAndroid) ? 10 : -30,
	        	color:'#000',
	        	touchEnabled:false
	        });
	        c = article.content.substr(0, 100);
	        if (isAndroid && article.content.length > 47) {
	        	c = article.content.substr(0, 50) + "..."
	        }
	        contentLabel = Ti.UI.createLabel({
		        text: c,
		        font:{
		            fontSize:'16dp'
		        },
		        left:72,
		        top:(isAndroid) ? 40 : 30,
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
	        view.add(titleLabel);
	        view.add(contentLabel);
	        view.add(img);
	        row.add(view);
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
		backgroundColor: '#fff',
		data:e.row.raw
	});
	//var wb = Ti.UI.createWebView({url:e.row.raw.permalink});
	//w.add(wb);
	Titanium.UI.currentTab.open(w,{animated:true});
});
