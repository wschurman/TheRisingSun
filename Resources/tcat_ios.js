var isAndroid = (Titanium.Platform.name == 'android');

// Strings
var FROM_LABEL = 'Starting Point';
var TO_LABEL = 'Destination';
var DEPART_LABEL = 'Departure Time';
var SUBMIT_TEXT = 'Find Route!';

// Destinations - maybe change to Ajax call in the future
var destinations = [];
destinations[0]=Titanium.UI.createPickerRow({title:'North Campus'});
destinations[1]=Titanium.UI.createPickerRow({title:'Central Campus'});
destinations[2]=Titanium.UI.createPickerRow({title:'Collegetown'});
destinations[3]=Titanium.UI.createPickerRow({title:'Downtown'});
destinations[4]=Titanium.UI.createPickerRow({title:'Pyramid Mall'});

// Heights and widths
var ELEMENT_HEIGHT = 55;
var LABEL_WIDTH = 165;
var TEXT_FIELD_WIDTH = 250;
var SUBMIT_WIDTH = 450;

// The entire window (not including the tab)
var win = Titanium.UI.currentWindow;

// Submit button
var submitButton = null;

// Build the page

var array = [];
var startRow = Titanium.UI.createTableViewRow({height:46, className:'startRow'}); 
var destRow = Titanium.UI.createTableViewRow({height:46, className:'destRow'}); 
var timeRow = Titanium.UI.createTableViewRow({height:46, className:'timeRow'});
var startLabel = Ti.UI.createLabel({color:'#000000', text:"Start", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:99});
var startText = Titanium.UI.createTextField({value:"", color:'#336699', font:{fontSize:16, fontWeight:'bold'},top:8, left:100, height:32, width:184,
	hintText:'Start',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
var destLabel = Ti.UI.createLabel({color:'#000000', text:"Destination", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:170});
var timeLabel = Ti.UI.createLabel({color:'#000000', text:"Time", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:170});
var destData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:17, fontWeight:'normal'}, top:11, left:102, height:20, width:180, textAlign:'right'});	
var timeData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:17, fontWeight:'normal'}, top:11, left:102, height:20, width:180, textAlign:'right'});	
startRow.add(startLabel);
startRow.add(startText);
destRow.add(destLabel);
destRow.add(destData);
timeRow.add(timeLabel);
timeRow.add(timeData);
array.push(startRow);
array.push(destRow);
array.push(timeRow);

// Getters
var getFromField = function() { return startText; };
var getToField = function() { return destData; };
var getTimeField = function() { return timeData; };
var getSubmitButton = function() { return submitButton; };

var setSubmitButtonAction = function(event, action) {
	submitButton.addEventListener(event, action);
};

var tableView = Titanium.UI.createTableView({data:array, style:Titanium.UI.iPhone.TableViewStyle.GROUPED});
var destPickerView = Titanium.UI.createView({height:260,bottom:-260});
var timePickerView = Titanium.UI.createView({height:260,bottom:-260});

var destPicker = Titanium.UI.createPicker({
	top:43,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE
});
var destDone =  Titanium.UI.createButton({
  title:'Done',
  style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});
var destSpacer =  Titanium.UI.createButton({
  systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var destToolbar =  Titanium.UI.createToolbar({
  height: 43,
  top: 0,
  items:[destSpacer,destDone]
});
destPicker.add(destinations);
destPicker.selectionIndicator=true;
destPickerView.add(destToolbar);
destPickerView.add(destPicker);

var timePicker = Titanium.UI.createPicker({
	top:43,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_ROUTE,
	type:Titanium.UI.PICKER_TYPE_TIME,
});
var timeDone =  Titanium.UI.createButton({
  title:'Done',
  style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});
var timeSpacer =  Titanium.UI.createButton({
  systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var timeToolbar =  Titanium.UI.createToolbar({
  height: 43,
  top: 0,
  items:[timeSpacer,timeDone]
});
timePicker.selectionIndicator=true;
timePickerView.add(timeToolbar);
timePickerView.add(timePicker);

var slideIn =  Titanium.UI.createAnimation({bottom:-40});
var slideOut =  Titanium.UI.createAnimation({bottom:-265});

// event functions
tableView.addEventListener('click', function(eventObject){
	if (eventObject.rowData.className == "timeRow")
	{
		startText.blur();
		destPickerView.animate(slideOut);	
		timePickerView.animate(slideIn);		
	}
	else if (eventObject.rowData.className == "startRow")
	{
		destPickerView.animate(slideOut);
		timePickerView.animate(slideOut);
		startText.focus();	
	}
	else if (eventObject.rowData.className == "destRow")
	{
		timePickerView.animate(slideOut);
		destPickerView.animate(slideIn);
		startText.blur();	
	};
});

timePicker.addEventListener('change',function(e)
{
	timeData.text = e.value;
	tableView.setData(array);
});

destPicker.addEventListener('change',function(e)
{
	destData.text = destPicker.getSelectedRow(0).title;
	tableView.setData(array);
});

startText.addEventListener('focus',function() {
	destPickerView.animate(slideOut);
	timePickerView.animate(slideOut);
});


destDone.addEventListener('click', function(event) {
  	destData.text = destPicker.getSelectedRow(0).title;
	tableView.setData(array);
  	destPickerView.animate(slideOut);
});
timeDone.addEventListener('click', function(event) {
  	timeData.text = timePicker.value;
	tableView.setData(array);
  	timePickerView.animate(slideOut);
});

submitButton = Titanium.UI.createButton({
	width:300,
	height:55,
	top:170,
	enabled:true,
	visible:true,
	title:SUBMIT_TEXT,
});

// Add all of our built-up elements
win.add(tableView);
win.add(submitButton);
win.add(destPickerView);
win.add(timePickerView);

// Add functionality
var findRoute = function() {
	// Make Ajax call to grab data; for now, we just have dummy JSON
	// var data = $.ajax(startingPoint : userStartingPoint, destination : userDestination)...
	var data = {
		startingPoint :
			{ latitude : 37.390749, longitude : -122.081651, name : 'Mountain View Headquarters'},
		destination :
			{ latitude : 37.511389, longitude : -122.208311, name : 'Random Destination'},
		directions :
			[
				'Walk .14 miles to Stop 1 and get on Route 14. It departs at 2:40 PM.',
				'Travel .80 miles to Stop 2 and get on Route 30. It departs at 3:30 PM.',
				'Travel .03 miles to Stop 3. This is the final stop. Walk from here to Random Destination.'
			]
	}
	
	var w = Ti.UI.createWindow({
		title:"TCAT Route - Map",
		url:"textRoute.js",
		from:getFromField().value,
		to:getToField().value,
		data:data
	});
	Titanium.UI.currentTab.open(w,{animated:true});
};

setSubmitButtonAction('click', findRoute);



