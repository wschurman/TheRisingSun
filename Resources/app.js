/*
 * TheRisingSun
 * 
 */

var NEWS_TAB = "The Sun"
var NEWS_TITLE = "The Cornell Daily Sun";
var BUS_TITLE = "Take the Bus";
var BUS_TAB = BUS_TITLE;
var DINING_TITLE = "Dining Guide";
var DINING_TAB = DINING_TITLE;

Titanium.UI.setBackgroundColor('#FFF');
var isAndroid = (Titanium.Platform.name == 'android');

var tabGroup = Titanium.UI.createTabGroup({
	id:'tabGroup1',
	barColor:'#111'
});
//'Sun', 'Restaurants', 'TCAT'
var win1 = Titanium.UI.createWindow({
	className:'win1',
	title:NEWS_TITLE,
	backgroundColor: '#fff',
	url:'sun.js'
});

var tab1 = Titanium.UI.createTab({
	id:'tab1',
	icon:'images/tabs/news.png',
	title:NEWS_TAB,
	window:win1
});

var win2 = Titanium.UI.createWindow({
	className:'win2',
	title:BUS_TITLE,
	backgroundColor: '#fff',
	url: (isAndroid) ? 'tcat.js' : 'tcat_ios.js'
});

var tab2 = Titanium.UI.createTab({
	id:'tab2',
	icon:'images/tabs/bus.png',
	title:BUS_TAB,
	window:win2
});


var win3 = Titanium.UI.createWindow({
	className:'win3',
	title:DINING_TITLE,
	backgroundColor: '#fff',
	url:'food.js'
});

var tab3 = Titanium.UI.createTab({
	id:'tab3',
	icon:'images/tabs/dining.png',
	title:DINING_TAB,
	window:win3
});


tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);

tabGroup.addEventListener('open',function()
{
	Titanium.UI.setBackgroundColor('#fff');
});

tabGroup.setActiveTab(0);
// open tab group with a transition animation
tabGroup.open({
	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});