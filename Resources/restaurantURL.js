var win = Titanium.UI.currentWindow;
win.backgroundColor = '#fff';

var tv = Ti.UI.createTableView({minRowHeight:50});

var arrData = [];

var body = Ti.UI.createView({height:'auto', layout:'vertical', backgroundColor:'#fff'});

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	top:0,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:false
});

var textWrap = Ti.UI.createView({ 
	backgroundColor: '#fff', 
	height: 'auto', 
	width: '100%', 
	top: 0,
	left: 0,
	right: 0,
	bottom: 10
});

var wview = Titanium.UI.createWebView({
	url:win.data.url,
	data:win.data.url
})

win.add(wview);
wview.show();
