
/* Configurable Params */
var baseTitle = "The Cornell Daily Sun";
var baseTitleShort = "Sun";
var url = "http://wschurman.com/supports/test_sun.php";


var win = Titanium.UI.currentWindow;
win.title = baseTitle;

win.orientationModes = [
    Titanium.UI.PORTRAIT,
    Titanium.UI.UPSIDE_PORTRAIT,
    Titanium.UI.LANDSCAPE_LEFT,
    Titanium.UI.LANDSCAPE_RIGHT
];

var isAndroid = (Titanium.Platform.name == 'android');
var tableData = [];
var json, articles, article, i, j, row, view, titleLabel,
	contentLabel, h, contentTopPosition, c, hasImage, t_view, t_label, currLeftOffset;
var categories, catRendered = false;
var currCat = "";

/* Initial Layout Elements and Calculations*/

var table = Ti.UI.createTableView({
	top: 30
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

if (!isAndroid) Titanium.UI.currentWindow.setRightNavButton(r);

/* AJAX Request */

function refreshContent(cat, last) {
	currCat = cat;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
		    json = JSON.parse(this.responseText);
		    if(!catRendered) {
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


/* refreshTable
 * Used for initial data entry and to repopulate table
 */

function refreshTable(json) {
	tableData = [];
	table.setData([]);
        article = json.articles[0];
        
        var w = Ti.UI.createWindow({
			title:article.title,
			url:"article.js",
			backgroundColor: '#fff',
			data:article
		});
		Titanium.UI.currentTab.open(w,{animated:true});
}
