
var win = Titanium.UI.currentWindow;


// Test

var fromField = Titanium.UI.createTextField({
	color:'#000',
	top:10,
	left:10,
	width:250,
	height:40,
	hintText:'Start',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

var toField = Titanium.UI.createTextField({
	color:'#000',
	top:70,
	left:10,
	width:250,
	height:40,
	hintText:'End',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

fromField.addEventListener('return', function() {
	fromField.blur();
	toField.focus();
});

toField.addEventListener('return', function() {
	toField.blur();
	
	var w = Ti.UI.createWindow({
		title:"TCAT Route",
		url:"route.js",
		from: fromField.value,
		to: toField.value
	});
	Titanium.UI.currentTab.open(w,{animated:true});
});

win.add(fromField);
win.add(toField);