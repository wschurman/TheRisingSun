
var win = Titanium.UI.currentWindow;

var url = "http://localhost/~williamschurman/test.php";

var table = Ti.UI.createTableView();
var tableData = [];
var json, articles, article, i, row, titleLabel, dateLabel, authorLabel, contentLabel;
 
var xhr = Ti.Network.createHTTPClient({
    onload: function() {
    // Ti.API.debug(this.responseText);
 
	    json = JSON.parse(this.responseText);
	    for (i = 0; i < json.articles.length; i++) {
	        article = json.articles[i];
	        Ti.API.debug("ARTICLE: " + article.title);
	        Ti.API.debug("ARTICLE: " + articles[i+1].title);
	        Ti.API.debug("ARTICLE: " + articles[i+2].title);
	        row = Ti.UI.createTableViewRow({
	            height:'60dp'
	        });
	        titleLabel = Ti.UI.createLabel({
	            text:article.title,
	            font:{
	                fontSize:'24dp',
	            	fontWeight:'bold'
	        	},
	        	height:'auto',
	        	left:'10dp',
	        	top:'5dp',
	        	color:'#000',
	        	touchEnabled:false
	        });
	        contentLabel = Ti.UI.createLabel({
		        text:article.content.substr(0, 100),
		        font:{
		            fontSize:'16dp'
		        },
		        height:'auto',
		        left:'15dp',
		        bottom:'5dp',
		        color:'#000',
		        touchEnabled:false
	        });
	 
	        row.add(titleLabel);
	        row.add(contentLabel);
	        tableData.push(row);
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
