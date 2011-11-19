/* Configurable Params */
var baseTitle = "The Cornell Daily Sun";
var baseTitleShort = "Sun";
var url = "http://wschurman.com/supports/test_sun.php";

var win = Titanium.UI.currentWindow;
win.title = baseTitle;

win.orientationModes = [
    Titanium.UI.PORTRAIT
];

var isAndroid = (Titanium.Platform.name == 'android');
var tableData = [];
var json, articles, article, i, j, row, view, titleLabel,
	contentLabel, h, contentTopPosition, c, hasImage, t_view, t_label, currLeftOffset;
var categories, catRendered = false;
var currCat = "";

/* Android menu */

if (isAndroid) {
	var activity = Ti.Android.currentActivity;
	activity.onCreateOptionsMenu = function(e) {
	    var menu = e.menu;
	    var menuItem = menu.add({ title: "Refresh" });
	    menuItem.setIcon("images/tabs/KS_nav_mashup.png");
	    menuItem.addEventListener("click", function(e) {
	        refreshContent(currCat, "");
	    });
	};
}

/* Initial Layout Elements and Calculations*/

var table = Ti.UI.createTableView({
	top: 55
});
var scrollView = Titanium.UI.createScrollView({
	contentWidth:805,
	contentHeight:55,
	top:0,
	showVerticalScrollIndicator:false,
	showHorizontalScrollIndicator:false,
	height:55,
	width:"auto",
	backgroundColor:'#9A1011',
	backgroundGradient:{
		type:'linear',
		colors:[{color:'#B75657',position:0.0},{color:'#9A1011',position:1.0}]
	}
});

var shadow = Ti.UI.createView({
	backgroundImage:"images/shadow_b.png",
	height:5,
	width: "auto",
	top: 55
})

if (isAndroid) {
	h = 150;
	contentTopPosition = 40;
} else {
	h = 110;
	contentTopPosition = 30;
}

var r = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
});
r.addEventListener('click',function()
{
	// reload feed
	refreshContent(currCat, "");
});

if (!isAndroid) Titanium.UI.currentWindow.setRightNavButton(r);

/* AJAX Request */

function refreshContent(cat, last) {
	currCat = cat;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
		    json = JSON.parse(this.responseText);
		    if(!catRendered) {
		    	renderCategories(json.categories);
		    	catRendered = true;
		    }
		    refreshTable(json);
		},
	    onerror: function(e) {
	    	Ti.API.debug("STATUS: " + this.status);
	    	Ti.API.debug("TEXT:   " + this.responseText);
	    	Ti.API.debug("ERROR:  " + e.error);
	    	alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:5000
	});
	 
	xhr.open("GET", url+"?cat="+cat+"&last="+last);
	xhr.send();
}

refreshContent("", "");
win.add(scrollView);
win.add(table);
win.add(shadow);

/* renderCategories
 * Renders the top category bar contents
 */

function renderCategories(categories) {
	// TODO: add all cat button
	currLeftOffset = 5;
	for (j = 0; j < categories.length; j++) {
		
		t_view = Ti.UI.createView({
			backgroundColor:'#6E1618',
			borderRadius:10,
			borderWidth:0,
			borderColor:'#336699',
			backgroundSelectedColor:'#3D090A',
			width:110,
			height:45,
			top: 5,
			left:currLeftOffset,
			raw:categories[j]
		});
		scrollView.add(t_view);
		
		t_label = Ti.UI.createLabel({
			text:categories[j].name,
			font:{fontSize:17},
			color:'#fff',
			width:'auto',
			textAlign:'center',
			height:45,
			touchEnabled:false
		});
		t_view.add(t_label);
		
		currLeftOffset += 115;
		
		t_view.addEventListener('click',function(e) {
			refreshContent(e.source.raw.id, "");
			win.title = baseTitleShort + " - " + e.source.raw.name;
		});
		
		if (!isAndroid) {
			t_view.addEventListener('touchstart', function(e) {
				e.source.backgroundColor = "#3D090A";
			});
			t_view.addEventListener('touchend', function(e) {
				e.source.backgroundColor = "#6E1618";
			});
		}
		
	}
	scrollView.contentWidth = currLeftOffset;
}

/* refreshTable
 * Used for initial data entry and to repopulate table
 */

function refreshTable(json) {
	tableData = [];
	table.setData([]);
	for (i = 0; i < json.articles.length; i++) {
        article = json.articles[i];
        
        row = Ti.UI.createTableViewRow({
            height: h,
            //hasChild:true,
            //hasDetail:(i < 2) // for future unread icons
        });
        
        hasImage = article.thumb != "";
        
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
                fontSize:'16dp',
            	fontFamily:"Georgia",
        	},
        	left: 5,
        	//top: 80,
        	height:30,
        	width: (hasImage) ? "70%" : "100%",
        	//top:(isAndroid) ? 10 : -30,
        	top:5,
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
	        left:5,
	        top:contentTopPosition,
	        width: (hasImage) ? "70%" : "100%",
	        color:'#333',
	        touchEnabled:false
        });
 		var img;
 		var media = article.thumb;
 		if (hasImage) {
			img = Ti.UI.createImageView({
				image:media,
				right:5,
				height:70,
				width:70
			});
			view.add(img);
		}
        view.add(titleLabel);
        view.add(contentLabel);
        row.add(view);
		tableData.push(row);
		row.url = article.permalink;
		row.raw = article;
    }
	table.setData(tableData);
}

/* Listeners */

table.addEventListener('click',function(e) {
	var w = Ti.UI.createWindow({
		title:e.row.raw.title,
		url:"article.js",
		backgroundColor: '#fff',
		data:e.row.raw
	});
	Titanium.UI.currentTab.open(w,{animated:true});
});
