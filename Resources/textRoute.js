var win = Titanium.UI.currentWindow;

var userStartingPoint = win.from;
var userDestination = win.to;
var data = win.data;

var table = Ti.UI.createTableView({
	top: 0
});

var row;
var tableData = [];

// Create the textual directions
for (var k = 0; k < data.directions.length; k++) {
	row = Ti.UI.createTableViewRow({
            height: 60,
            backgroundColor: (k % 2 == 1) ? "#E2E4EA" : "#fff"
            //hasChild:true,
            //hasDetail:(i < 2) // for future unread icons
        });
	
	var view = Titanium.UI.createView({
	});
	
	var num = Titanium.UI.createLabel({
		color:"#333",
		font:{
			fontSize:20
		},
		text:k+1,
		left: 10,
		width: 25,
		textAlign:"center"
	});
	
	var label = Titanium.UI.createLabel({
		color:'#111',
		font: {
			fontSize:15
		},		
		text:data.directions[k].direction,
		top:0,
		left: 45,
		height: 60
	});
	view.add(num);
	view.add(label)
	row.add(view);
	tableData.push(row);
}

table.setData(tableData);

win.add(table);