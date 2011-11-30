var isAndroid = (Titanium.Platform.name == 'android');

var url = "http://tcat.elasticbeanstalk.com/main";

// Strings
var FROM_LABEL = 'Starting Point';
var TO_LABEL = 'Destination';
var DEPART_LABEL = 'Departure Time';
var SUBMIT_TEXT = 'Find Route!';

// Destinations - maybe change to Ajax call in the future

var destination_texts = [
	"Ag Quad",
	"Airport",
	"Arts Quad",
	"Central Campus",
	"Collegetown",
	"Downtown",
	"Engineering Quad",
	"Hasbrouk Apartments",
	"Ithaca College",
	"North Campus",
	"Pyramid Mall",
	"The Commons",
	"Wegmans",
	"West Campus"
];

var destinations = [];

for (var j = 0; j < destination_texts.length; j++) {
	destinations[j] = Titanium.UI.createPickerRow({title:destination_texts[j]});
}


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
var submitRow = Titanium.UI.createTableViewRow({height:65, className:'submitRow', backgroundColor:"transparent", borderColor:"transparent", touchEnabled:false});
var startLabel = Ti.UI.createLabel({color:'#000000', text:"Start", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:99});
var destLabel = Ti.UI.createLabel({color:'#000000', text:"Destination", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:170});
var timeLabel = Ti.UI.createLabel({color:'#000000', text:"Time", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:170});
var startData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:17, fontWeight:'normal'}, top:11, left:102, height:20, width:150, textAlign:'right'});
var destData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:17, fontWeight:'normal'}, top:11, left:102, height:20, width:180, textAlign:'right'});	
var timeData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:17, fontWeight:'normal'}, top:11, left:102, height:20, width:180, textAlign:'right'});	
var timeRaw = "";
var startCurrentLocation = Ti.UI.createButton({
	image:"images/currloc.png",
	backgroundColor:"#3b7ef1",
	right: 10,
	top:10,
	style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
	borderRadius: 13,
	width: 26,
	height: 26,
	className:"currBtn"
});

submitButton = Titanium.UI.createButton({
	width:300,
	height:55,
	top:200,
	enabled:true,
	visible:true,
	title:SUBMIT_TEXT,
});

startRow.add(startLabel);
startRow.add(startData);
if (!(Titanium.Geolocation.locationServicesEnabled === false)) {
	startRow.add(startCurrentLocation);
}
destRow.add(destLabel);
destRow.add(destData);
timeRow.add(timeLabel);
timeRow.add(timeData);
//submitRow.add(submitButton);
array.push(startRow);
array.push(destRow);
array.push(timeRow);
//array.push(submitRow);

// Getters
var getFromField = function() { return startData; };
var getToField = function() { return destData; };
var getTimeField = function() { return timeData; };
var getSubmitButton = function() { return submitButton; };

var setSubmitButtonAction = function(event, action) {
	submitButton.addEventListener(event, action);
};

var tableView = Titanium.UI.createTableView({data:array, style:Titanium.UI.iPhone.TableViewStyle.GROUPED, scrollable: false});

var startView = Ti.UI.createView({
	height:400,
	top:-460
});

var search = Titanium.UI.createSearchBar({
   height:43,
   showCancel:true,
   hintText:'Search...',
   top:0,
   returnKeyType:Titanium.UI.RETURNKEY_NEXT,
});
 
//AUTOCOMPLETE TABLE
var table_data = [];
var autocomplete_table = Titanium.UI.createTableView({
   search: search,
   scrollable: true,
   top:0
});
startView.add(autocomplete_table);


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
var slideInTop =  Titanium.UI.createAnimation({top:0});
var slideOutTop =  Titanium.UI.createAnimation({top:-460});

// event functions
tableView.addEventListener('click', function(eventObject){
	if (eventObject.rowData.className == "timeRow")
	{
		startView.animate(slideOutTop);
		destPickerView.animate(slideOut);	
		timePickerView.animate(slideIn);		
	}
	else if (eventObject.rowData.className == "startRow")
	{
		if (eventObject.source.className != "currBtn") {
			destPickerView.animate(slideOut);
			timePickerView.animate(slideOut);
			startView.animate(slideInTop);
		}
	}
	else if (eventObject.rowData.className == "destRow")
	{
		timePickerView.animate(slideOut);
		destPickerView.animate(slideIn);
		startView.animate(slideOutTop);	
	};
});

search.addEventListener('cancel', function() {
	startView.animate(slideOutTop);
});

search.addEventListener('return', function() {
	startData.text = search.value;
	startView.animate(slideOutTop);
});

timePicker.addEventListener('change',function(e)
{
	var d = new Date(e.value);
	timeRaw = e.value;
	timeData.text = d.toLocaleTimeString();
	tableView.setData(array);
});

destPicker.addEventListener('change',function(e)
{
	destData.text = destPicker.getSelectedRow(0).title;
	tableView.setData(array);
});

/*start.addEventListener('focus',function() {
	destPickerView.animate(slideOut);
	timePickerView.animate(slideOut);
});*/


destDone.addEventListener('click', function(event) {
  	destData.text = destPicker.getSelectedRow(0).title;
	tableView.setData(array);
  	destPickerView.animate(slideOut);
});
timeDone.addEventListener('click', function(event) {
  	var d = new Date(timePicker.value);
  	timeRaw = timePicker.value;
	timeData.text = d.toLocaleTimeString();
	tableView.setData(array);
  	timePickerView.animate(slideOut);
});

// Add all of our built-up elements
win.add(tableView);
win.add(submitButton);
win.add(startView);
win.add(destPickerView);
win.add(timePickerView);

// Add functionality
var findRoute = function() {
	// Make Ajax call to grab data; for now, we just have dummy JSON
	// var data = $.ajax(startingPoint : userStartingPoint, destination : userDestination)...
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	if (this.status != 200) {
	    		alert('There was an error retrieving the remote data. Try again. '+ this.status);
	    		return;
	    	}
		    json = JSON.parse(this.responseText);
		    if (json.error) {
		    	alert(json.error);
	    		return;
		    }
		    openMap(json);
		},
	    onerror: function(e) {
	    	Ti.API.debug("STATUS: " + this.status);
	    	Ti.API.debug("TEXT:   " + this.responseText);
	    	Ti.API.debug("ERROR:  " + e.error);
	    	alert('There was an error retrieving the remote data. Please try again.');
	    },
	    timeout:5000
	});
	
	xhr.open("GET", url+"?from="+startData.text+"&to="+destData.text+"&date="+timeRaw);
	xhr.send();
};

function openMap(data) {
	var w = Ti.UI.createWindow({
		title:"TCAT Route",
		url:"mapRoute_ios.js",
		from:startData.text,
		to:destData.text,
		data:data
	});
	Titanium.UI.currentTab.open(w,{animated:true});
}

setSubmitButtonAction('click', findRoute);

//
// SEARCH BAR EVENTS
//
var timers = [];
var last_search = null;
search.addEventListener('change', function(e)
{
   if (search.value.length > 1 && search.value != last_search) {
      clearTimeout(timers['autocomplete']);
      timers['autocomplete'] = setTimeout(function()
      {
         last_search =search.value;
         auto_complete(search.value);
      }, 300);
   }
   return false;
});

autocomplete_table.addEventListener("click", function(e) {
	startData.text = e.row.title;
	startView.animate(slideOutTop);
});
 
function auto_complete(search_term)
{
    if (search_term.length > 2)
    {
        var url2 = url + '?search=' + escape(search_term);
        
        var xhr = Ti.Network.createHTTPClient({
		    onload: function() {
		    	if (this.status != 200) {
	    			return;
	    		}
		    	var json2 = JSON.parse(this.responseText);
		    	var list = json2.possible_searches;
				table_data = [];
	            for (var i = 0; i < list.length; i++)
	            {
	                //Ti.API.info('row data - ' + data[i].value);
	                var row = Ti.UI.createTableViewRow({
	                    height: 40,
	                    title: list[i].replace(/^\s+|\s+$/g,""),
	                    hasDetail:true
	                });
	                table_data.push(row);
	            }
	            autocomplete_table.setData(table_data);
        		search.value = search.value;
			},
		    onerror: function(e) {
		    	Ti.API.debug("STATUS: " + this.status);
		    	Ti.API.debug("TEXT:   " + this.responseText);
		    	Ti.API.debug("ERROR:  " + e.error);
		    },
		    timeout:1500
		});
		
		xhr.open("GET", url2);
		xhr.send();
    }
}

startCurrentLocation.addEventListener("click", function(e) {
	Ti.Geolocation.preferredProvider = "gps";
	Ti.Geolocation.purpose = "GPS demo";
	
	if (Titanium.Geolocation.locationServicesEnabled === false) {
		Titanium.UI.createAlertDialog({title:'TCAT', message:'Your device has geolocation turned off. Please enter your location manually.'}).show();
	} else {
		
		if (Titanium.Platform.name != 'android') {
			var authorization = Titanium.Geolocation.locationServicesAuthorization;
			Ti.API.info('Authorization: '+authorization);
			if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
				Ti.UI.createAlertDialog({
					title:'TCAT',
					message:'You have disallowed Titanium from running geolocation services. Please enter your location manually.'
				}).show();
			}
			else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
				Ti.UI.createAlertDialog({
					title:'TCAT',
					message:'Your system has disallowed Titanium from running geolocation services. Please enter your location manually.'
				}).show();
			}
		}
		
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error)
			{
				alert('There was an error getting your position. Please enter your location manually.');
				return;
			}
	
			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;
	
			Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
			
			startData.text = latitude+","+longitude;
		});
	}
	
	return false;
});
//hello