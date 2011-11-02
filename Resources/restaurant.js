var win = Titanium.UI.currentWindow;
win.backgroundColor = '#fff';

if(win.title == win.data.title){
	var wview = Titanium.UI.createWebView({
	url:win.data.url,
	data:win.data.url
	})

	win.add(wview);
	wview.show();
	
}
else{

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




 for (i = 0; i < win.data.reviews.length; i++) {
 	
 	var row = Ti.UI.createTableViewRow({height:'auto',className:"row"});
	
	var textView = Ti.UI.createView({
		height:'auto',
		layout:'vertical',
		left:0,
		top:0,
		bottom:0,
		right:0,
		backgroundColor:'#eee'
	});
	
	var l1 = Ti.UI.createView({
		width: '100dp',
		height: '25dp',
		right: 3,
		top:3
	});
	
	if(win.data.reviews[i].rating == 1){
			l1.backgroundImage = 'images/1_stars.png';
		}
		else if(win.data.reviews[i].rating == 2){
			l1.backgroundImage = 'images/2_stars.png';
		}
		else if(win.data.reviews[i].rating == 3){
			l1.backgroundImage = 'images/3_stars.png';
		}
		else if(win.data.reviews[i].rating == 4){
			l1.backgroundImage = 'images/4_stars.png';
		}
		else if(win.data.reviews[i].rating == 5){
			l1.backgroundImage = 'images/5_stars.png';
		}
		
	textView.add(l1);
	
	var l2 = Ti.UI.createLabel({
		text:win.data.reviews[i].author,
		height:'auto',
		color:'#000',
		bottom:20,
		font:{fontSize:14, fontWeight: 'bold'},
		color: '#00688B',
		left:0
	});
	textView.add(l2);

	var l3 = Ti.UI.createLabel({
		text:win.data.reviews[i].content,
		color:'#000',
		font:{fontSize:11},
		top:3,
		height:'auto',
		left:5
	});
	textView.add(l3);
	
	row.add(textView);
	
	
	arrData.push(row);
}
tv.setData(arrData);

win.add(tv);
 	
}