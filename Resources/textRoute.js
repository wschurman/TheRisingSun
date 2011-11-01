var win = Titanium.UI.currentWindow;

var data = win.data;

var directions = [];

function getTransferDirections(distance, name, transferTo, departureTime) {
	return distance + ' to ' + name + ' and transfer to ' + transferTo + '. It departs at ' + departureTime + '.';
}

// Add the starting point
var startingPointDirections = 'Walk ' + getTransferDirections(data.stops[0].distanceTo, data.stops[0].name, data.stops[0].transferTo, data.stops[0].departureTime);
directions.push(startingPointDirections);

// Add all the stops
for (var i = 1; i < data.stops.length; i++) {
	directions.push('Travel ' + getTransferDirections(data.stops[i].distanceTo, data.stops[i].name, data.stops[i].transferTo, data.stops[i].departureTime));	
}

// Add the final walking directions
directions.push('Walk from the final stop to ' + data.destination.name);

// Create a label and add it to the window
for (var k = 0; k < directions.length; k++) {
	var label = Titanium.UI.createLabel({
		text:directions[k] + "\n"
	});
	win.add(label);
}