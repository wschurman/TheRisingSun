
var win = Titanium.UI.currentWindow;


// Test

var fromLabel = Titanium.UI.createLabel({
	color:'#000000',
	top:20,
	left:10,
	width:150,
	height:55,
	text:'Starting Point'
});

var fromField = Titanium.UI.createTextField({
	color:'#000',
	top:20,
	left:150,
	width:250,
	height:55,
	hintText:'Start',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

var toLabel = Titanium.UI.createLabel({
	color:'#000000',
	top:80,
	left:10,
	width:150,
	height:55,
	text:'Destination'
});

var toField = Titanium.UI.createTextField({
	color:'#000',
	top:80,
	left:150,
	width:250,
	height:55,
	hintText:'End',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

var submitButton = Titanium.UI.createButton({
	width:450,
	height:55,
	bottom:10,
	enabled:true,
	visible:true,
	title:'Find Route!',
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

win.add(fromLabel);
win.add(fromField);
win.add(toLabel);
win.add(toField);
win.add(submitButton);