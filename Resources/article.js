var win = Titanium.UI.currentWindow;
var isAndroid = (Titanium.Platform.name == 'android');

var hasImage = win.data.thumb != "";
var date = new Date(win.data.date);

var scrollView = Titanium.UI.createScrollView({
	contentWidth:"100%",
	contentHeight:"auto",
	top:0,
	width: "100%",
	height: "100%",
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:false,
});


var textWrap = Ti.UI.createView({ 
	backgroundColor: '#FFF', 
	height: 'auto', 
	width: "auto",
	left:5,
	top: 10,
	layout:'vertical'
});

if (!isAndroid) {
	Titanium.Admob = Ti.Admob = require('ti.admob');
	var ad;
	textWrap.add(ad = Ti.Admob.createView({
	    top: 0, left: 0,
	    width: "auto", height: 50,
	    publisherId: '<<YOUR PUBLISHER ID HERE>>',
	    adBackgroundColor: 'black',
	    testing: true,
	    dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
	    gender: 'male',
	    keywords: ''
	}));
}

var title_text = Ti.UI.createLabel({
	id:"title_text",
	text: win.data.title,
	width:"100%",
	top:5,
	left: 5,
	font:{
		fontFamily:"Georgia",
		fontSize: (isAndroid) ? 25 : 20
	},
	height:"auto",
	color: "#111"
	
});

function openInBrowser() {
	var w = Ti.UI.createWindow();

	var webview = null;
	webview = Ti.UI.createWebView({
		url:win.data.permalink
	});
	
	w.add(webview);
	
	Titanium.UI.currentTab.open(w,{animated:true});
}

title_text.addEventListener('click', function() {
	openInBrowser();
});

var date_text = Ti.UI.createLabel({
	id: 'article_date',
	text: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
	font: {fontSize: (isAndroid) ? 18 : 13},
	color: "#9B9B9B",
	right: 5,
	width:"auto",
	height: 25
});

var img_view = Ti.UI.createView({
	top: 5,
	width:"100%",
	height: "auto"
});

var image = null;
var author_text = null;
var comments_button = null;

if (hasImage) {
	
	img = Ti.UI.createImageView({
		id:"img",
		image:win.data.thumb, // change to full image
		top: 0,
		width:"150px",
		height:"140px",
		left:5
	});
	author_text = Ti.UI.createLabel({
		id:"author_text",
		top: 10,
		left: "170px",
		text: "by " + win.data.author,
		color:"#383838",
		width:200,
		height: "auto",
		font: {fontSize: 18},
	});
	comments_button = Titanium.UI.createButton({
		id:"comments_button",
		title: win.data.comment_count + " comments",
		width:140,
		height: (isAndroid) ? 45 : 25,
		top: 50,
		left: "170px",
		font: {
			fontSize: 14,
		},
		color: "#000"
	});
	
	img_view.add(img);
	img_view.add(author_text);
	img_view.add(comments_button);
} else { // no image
	author_text = Ti.UI.createLabel({
		id:"author_text_noimg",
		top: 10,
		left: 0,
		text: "by " + win.data.author,
		color:"#383838",
		width:200,
		height: "auto",
		font: {fontSize: 13},
	});
	
	comments_button = Titanium.UI.createButton({
		id:"comments_button_noimg",
		title: win.data.comment_count + " comments",
		width:140,
		height: (isAndroid) ? 45 : 25,
		top: 10,
		right: 0,
		font: {
			fontSize: 14,
		},
		color: "#000"
		
	});
	
	img_view.add(author_text);
	img_view.add(comments_button);
}

comments_button.addEventListener('click', function()
{
	var w = Ti.UI.createWindow({
		title:"Comments",
		url:"comments.js",
		backgroundColor: '#fff',
		data:win.data.comments
	});
	Titanium.UI.currentTab.open(w,{animated:true});
});

var body_text = Titanium.UI.createLabel({
	id:'article_content',
	text: win.data.content,
	font: {fontSize: (isAndroid) ? 21 : 17},
	top: 5,
	height:'auto',
	width:Titanium.Platform.displayCaps.platformWidth - 20,
	color:"#383838"
});

var read_more = Ti.UI.createButton({
	id:"read_more",
	title: "Read More",
	width: "100%",
	height: 60,
	top: 5
});

read_more.addEventListener('click', function() {
	openInBrowser();
});

var bottom_spacing = Ti.UI.createView({
	height: 20,
	width: "100%",
	top: 5
})

textWrap.add(date_text);
textWrap.add(title_text);
textWrap.add(img_view);
textWrap.add(body_text);
textWrap.add(read_more);
textWrap.add(bottom_spacing);

scrollView.add(textWrap);

win.add(scrollView);
