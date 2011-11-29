Titanium.UI.setBackgroundColor('#FFF');

var tabGroup = Titanium.UI.createTabGroup({
	id:'tabGroup1',
	barColor:'#111'
});
//'Sun', 'Restaurants', 'TCAT'
var win1 = Titanium.UI.createWindow({
	className:'win1',
	title:'Sun',
	backgroundColor: '#fff',
	url:'sun.js'
});

var tab1 = Titanium.UI.createTab({
	id:'tab1',
	icon:'images/tabs/news.png',
	title:'The Sun',
	window:win1
});

var win2 = Titanium.UI.createWindow({
	className:'win2',
	title:'TCAT',
	backgroundColor: '#fff',
	url:'tcat.js'
});

var tab2 = Titanium.UI.createTab({
	id:'tab2',
	icon:'images/tabs/bus.png',
	title:'TCAT',
	window:win2
});


var win3 = Titanium.UI.createWindow({
	className:'win3',
	title:'Food',
	backgroundColor: '#fff',
	url:'food.js'
});

var tab3 = Titanium.UI.createTab({
	id:'tab3',
	icon:'images/tabs/dining.png',
	title:'Dining Guide',
	window:win3
});


tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);

tabGroup.addEventListener('open',function()
{
	// set background color back to white after tab group transition
	Titanium.UI.setBackgroundColor('#fff');
});

tabGroup.setActiveTab(0);
// open tab group with a transition animation
tabGroup.open({
	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});