var win = Titanium.UI.currentWindow;

var userStartingPoint = win.from;
var userDestination = win.to;
var data = win.data;

var scrollView = Titanium.UI.createScrollView({
	backgroundColor: '#FFF',
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
	width: 'auto',
	left:5,
	top:10,
	layout:'vertical'
});

// Create the textual directions
for (var k = 0; k < data.directions.length; k++) {
	var label = Titanium.UI.createLabel({
		color:'#111',
		font: {
			fontFamily:'Georgia',
			fontSize:20
		},		
		text:data.directions[k] + "\n"
	});
	textWrap.add(label);
}

// Create the link to the Map
var viewMap = Titanium.UI.createButton({
	width:450,
	height:55,
	bottom:10,
	enabled:true,
	visible:true,
	title:'View Map',
});

// Add functionality
viewMap.addEventListener('click', function() {	
	var w = Ti.UI.createWindow({
		title:"TCAT Route - Map",
		url:"mapRoute.js",
		from:userStartingPoint,
		to:userDestination,
		data:data
	});
	Titanium.UI.currentTab.open(w,{animated:true});
});

scrollView.add(textWrap);
win.add(scrollView);
win.add(viewMap);
