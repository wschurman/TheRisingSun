/*
 * Controller for the news app
 */

/* Configurable Params */
var baseTitle = "The Cornell Daily Sun";
var baseTitleShort = "Sun";

var win = Titanium.UI.currentWindow;
var isAndroid = (Titanium.Platform.name == 'android');

win.title = baseTitle;

var tableData = [];
var json, articles, article, i, j, row, view, titleLabel,
	contentLabel, h, contentTopPosition, c, hasImage, t_view, t_label, currLeftOffset;
var categories = [
	{name: "News", type: "content_news_story"},
	{name: "Sports", type: "content_sports_story"},
	{name: "Opinion", type: "content_opinion_piece"},
	{name: "Arts", type: "content_daze_story"},
	{name: "Science", type: "content_science_story"}
];
var catRendered = false;
var currCat = 0;
var currCatLabel = null;


/* Android refresh menu item */
if (isAndroid) {
	var activity = Ti.Android.currentActivity;
	activity.onCreateOptionsMenu = function(e) {
	    var menu = e.menu;
	    var menuItem = menu.add({ title: "Refresh" });
	    menuItem.setIcon("images/refresh.png");
	    menuItem.addEventListener("click", function(e) {
	        refreshContent(currCat);
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
	width: "100%",
	top: 55
});

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
	refreshContent(currCat);
});

if (!isAndroid) Titanium.UI.currentWindow.setRightNavButton(r);

/* AJAX Request */

function refreshContent(cat) {
	currCat = cat;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
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
	
	xhr.open("GET", 'http://cornellsun.com/services/rest/node.json?type='+(categories[cat].type));
	xhr.send();
}
renderCategories();
refreshContent(currCat);
win.add(scrollView);
win.add(table);
win.add(shadow);

/* renderCategories
 * Renders the top category bar contents
 */

function renderCategories() {
	currLeftOffset = 5;
	for (var j = 0; j < categories.length; j++) {
		
		t_view = Ti.UI.createView({
			backgroundColor:'#6E1618',
			borderRadius: (isAndroid) ? 0 : 10,
			borderWidth:0,
			borderColor:'#336699',
			//backgroundSelectedColor:'#3D090A',
			width:110,
			height:45,
			top: 5,
			left:currLeftOffset,
			raw:categories[j]
		});
		if (currCat == j) {
			t_view.backgroundColor = '#3D090A';
			currCatLabel = t_view;
		}
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
		
		var handler = function(index) {
			return function(e) {
				refreshContent(index);
				if(currCatLabel) {
					currCatLabel.backgroundColor = '#6E1618';
				}
				currCatLabel = e.source;
				e.source.backgroundColor = '#3D090A';
			};
		}
		
		t_view.addEventListener('click',handler(j));
	}
	scrollView.contentWidth = currLeftOffset;
}

/* refreshTable
 * Used for initial data entry and to repopulate table
 */

function refreshTable(json) {
	tableData = [];
	table.setData([]);
	for (var i = 0; i < json.length; i++) {
        article = json[i];
        
        row = Ti.UI.createTableViewRow({
            height: h,
            //hasChild:true,
            //hasDetail:(i < 2) // for future unread icons
        });
        
        hasImage = false;
        
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
        	//height:30,
        	height: 'auto',
        	//width: (hasImage) ? "70%" : "100%",
        	width: table.size.width-20,
        	//top:(isAndroid) ? 10 : -30,
        	top:5,
        	color:'#000',
        	touchEnabled:false
        });
        titleLabel.visible = false;
    	win.add(titleLabel);
    	win.remove(titleLabel);
    	titleLabel.visible = true;
        c = article.teaser.replace( /<[^>]+>/g, '' ).replace( /&nbsp;/g, ' ');
        if (isAndroid && article.teaser.length > 47) {
        	c = article.teaser.replace( /<[^>]+>/g, '' ).replace( /&nbsp;/g, ' ').substr(0, 50) + "...";
        }
        contentLabel = Ti.UI.createLabel({
	        text: c,
	        font:{
	            fontSize:'16dp'
	        },
	        left:5,
	        top: titleLabel.size.height+10,
	        //top: titleLabel.height,
	        width: (hasImage) ? "70%" : "100%",
	        color:'#333',
	        touchEnabled:false
        });
 		var img;
 		var media = "";
 		if (hasImage) {
			img = Ti.UI.createImageView({
				image:media,
				right:5,
				height:70,
				width:70
			});
			view.add(img);
		}
		titleLabel.width = "100%"
        view.add(titleLabel);
        view.add(contentLabel);
        row.add(view);
		tableData.push(row);
		row.url = article.uri;
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
		data_url:e.row.raw.uri+".json"
	});
	Titanium.UI.currentTab.open(w,{animated:true});
});
