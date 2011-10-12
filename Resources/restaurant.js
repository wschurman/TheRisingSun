var win = Titanium.UI.currentWindow;

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
	top: 10,
	left: 10,
	right: 10,
	bottom: 10
});

var l1 = Titanium.UI.createLabel({
	id:'article_content',
	text:win.data.name,
	font: {fontSize: 16},
	width: '100%',
	height:'auto',
});

textWrap.add(l1); 
scrollView.add(textWrap);
win.add(scrollView);