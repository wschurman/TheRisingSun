var win = Titanium.UI.currentWindow;
var isAndroid = (Titanium.Platform.name == 'android');

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

var comment;
var title, author, content;

for (var i = 0; i < win.data.length; i++) {
	comment = win.data[i];
	
	title = Ti.UI.createLabel({
		text: comment.title,
		height: "auto",
		width: "auto",
		top: (i == 0) ? 0 : 20,
		left: 0,
		font: {fontSize:16},
		color: "#111"
	});
	
	author = Ti.UI.createLabel({
		text: comment.name,
		height: "auto",
		width: "auto",
		left: 0,
		font: {fontSize:11},
		color: "#111"
	});
	
	content = Ti.UI.createLabel({
		text: comment.content,
		height: "auto",
		width: "auto",
		left: 0,
		font: {fontSize:13},
		color: "#111"
	});
	
	textWrap.add(title);
	textWrap.add(author);
	textWrap.add(content);
}

scrollView.add(textWrap);

win.add(scrollView);
