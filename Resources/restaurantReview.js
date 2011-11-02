var win = Titanium.UI.currentWindow;
win.backgroundColor = '#fff';

var wview = Titanium.UI.createWebView({
	url:win.data.url,
	data:win.data.url
})

win.add(wview);
wview.show();
