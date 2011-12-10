var win = Titanium.UI.currentWindow;
var isAndroid = (Titanium.Platform.name == 'android');

var xhr = Ti.Network.createHTTPClient({
	onload: function() {
		json = JSON.parse(this.responseText);
		if(json.field_images[0].nid != null) {
			loadImageArticle(json);
		} else {
			loadArticle(json);
		}
	},
	onerror: function(e) {
		Ti.API.debug("STATUS: " + this.status);
		Ti.API.debug("TEXT:   " + this.responseText);
		Ti.API.debug("ERROR:  " + e.error);
		alert('There was an error retrieving the remote data. Try again.');
	},
	timeout:5000
});
	 
xhr.open("GET", win.data_url);
xhr.send();

function loadImageArticle(data) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			json = JSON.parse(this.responseText);
			data.image_uri = escape(json.images.iphone);
			data.image_thumb = escape(json.images.thumbnail);
			data.image_credit = json.name;
			data.image_caption = json.body.replace( /<[^>]+>/g, '' ).replace( /&nbsp;/g, ' ').replace( /&amp;/g, '&');
			loadArticle(data);
		},
		onerror: function(e) {
			Ti.API.debug("STATUS: " + this.status);
			Ti.API.debug("TEXT:   " + this.responseText);
			Ti.API.debug("ERROR:  " + e.error);
			alert('There was an error retrieving the remote data. Try again.');
		},
		timeout:5000
	});
	 
	xhr.open("GET", "http://cornellsun.com/services/rest/node/"+data.field_images[0].nid+".json");
	xhr.send();
}

function loadArticle(data) {
	var hasImage = data.field_images[0].nid != null && !isAndroid;
	var date = new Date(parseInt(data.created)*1000);
	
	var scrollView = Titanium.UI.createScrollView({
		contentWidth:"100%",
		contentHeight:"auto",
		top:0,
		width: "100%",
		height: "100%",
		showVerticalScrollIndicator:true,
		showHorizontalScrollIndicator:false,
	});

	var textWrap = Ti.UI.createView({ 
		backgroundColor: '#FFF', 
		height: 'auto', 
		width: "auto",
		left:5,
		top: 10,
		layout:'vertical'
	});

	var title_text = Ti.UI.createLabel({
		id:"title_text",
		text: data.title,
		width:"100%",
		top:5,
		left: 5,
		font:{
			fontFamily:"Georgia",
			fontSize: (isAndroid) ? 25 : 20
		},
		height:"auto",
		color: "#111"
	});

	function openInBrowser() {
		var w = Ti.UI.createWindow();
	
		var webview = null;
		webview = Ti.UI.createWebView({
			url:"http://cornellsun.com/"+data.path
		});
	
		w.add(webview);
		
		Titanium.UI.currentTab.open(w,{animated:true});
	}
	
	function viewImage() {
		var w = Ti.UI.createWindow();
		var s = Ti.UI.createScrollView({
			contentWidth:"100%",
			contentHeight:"auto",
			top:0,
			width: "100%",
			height: "100%",
			showVerticalScrollIndicator:true,
			showHorizontalScrollIndicator:false,
		});
		w.add(s);
		var img = null;
		if(isAndroid) {
			img = Ti.UI.createImageView({
				id: 'photo',
				backgroundImage: 'http://cornellsun.com/'+data.image_uri, // For android
				top: 0,
				width: '100%',
				height: 'auto',
				left: 0
			});
		} else {
			img = Ti.UI.createImageView({
				id: 'photo',
				image: 'http://cornellsun.com/'+data.image_uri,
				top: 0,
				width: '100%',
				height: 'auto',
				left: 0
			});
		}
		
		s.add(img);
		
		if(data.image_credit.length == 0) {
			data.image_credit = "Sun Staff";
		}
		
		var credit = Ti.UI.createLabel({
			id: 'photo_credit',
			text: 'Photo by '+data.image_credit,
			font: {fontSize: 13},
			color: '#9B9B9B',
			top: img.size.height+5,
			left: 5,
			width: 'auto',
			height: 25
		});
		var caption = Ti.UI.createLabel({
			id: 'photo_caption',
			text: data.image_caption,
			font: {fontSize: 13},
			color: '#000000',
			top: credit.top+30,
			left: 5,
			//width: img.size.width,
			width: "100%",
			height: 'auto'
		});
		
		s.add(credit);
		s.add(caption);
		Ti.UI.currentTab.open(w,{animated: true});
		
	}

	title_text.addEventListener('click', function() {
		openInBrowser();
	});

	var date_text = Ti.UI.createLabel({
		id: 'article_date',
		text: date.toLocaleDateString(),
		font: {fontSize: (isAndroid) ? 18 : 13},
		color: "#9B9B9B",
		right: 5,
		width:"auto",
		height: 25
	});
	
	var img_view = Ti.UI.createView({
		top: 5,
		width:"100%",
		height: "auto"
	});
	
	var image = null;
	var author_text = null;
	var comments_button = null;
	
	if(data.name.length == 0) {
		data.name = 'Sun Staff';	
	}
	
	if (hasImage) {
		image = Ti.UI.createImageView({
			id:"img",
			image:"http://cornellsun.com/"+data.image_uri,
			top: 0,
			width:"150px",
			height:"140px",
			left:5
		});
		author_text = Ti.UI.createLabel({
			id:"author_text",
			top: 10,
			left: "170px",
			text: "by " + data.name,
			color:"#383838",
			width:200,
			height: "auto",
			font: {fontSize: 13},
		});
		comments_button = Titanium.UI.createButton({
			id:"comments_button",
			title: data.comment + " comments",
			width:140,
			height: (isAndroid) ? 45 : 25,
			top: 50,
			left: "170px",
			font: {
				fontSize: 14,
			},	
			color: "#000"
		});
		
		img_view.add(image);
		img_view.add(author_text);
		//img_view.add(comments_button);
		
		image.addEventListener('click', function() {
			viewImage();
		});
		
	} else { // no image
		author_text = Ti.UI.createLabel({
			id:"author_text_noimg",
			top: 10,
			left: 5,
			text: "by " + data.name,
			color:"#383838",
			width:200,
			height: "auto",
			font: {fontSize: 13},
		});
		img_view.add(author_text);
		
		comments_button = Titanium.UI.createButton({
			id:"comments_button_noimg",
			title: data.comment + " comments",
			width:140,
			height: (isAndroid) ? 45 : 25,
			top: 10,
			right: 0,
			font: {
				fontSize: 14,
			},
			color: "#000"
			
		});
		
		
		//img_view.add(comments_button);
	}
	
	var body_text = Titanium.UI.createLabel({
		id:'article_content',
		text: data.body.replace( /<p>/g, '\t\t' ).replace( /<\/p>/g, '\n' ).replace( /<br\s*\/?>/g, '\n\n' ).replace( /<[^>]+>/g, '' ).replace( /&nbsp;/g, ' ').replace( /&amp;/g, '&'),
		font: {fontSize: (isAndroid) ? 21 : 17},
		top: 5,
		height:'auto',
		width:Titanium.Platform.displayCaps.platformWidth - 20,
		color:"#383838"
	});
	
	var read_more = Ti.UI.createButton({
		id:"read_more",
		title: "Read More",
		width: "100%",
		height: 60,
		top: 5
	});
	
	read_more.addEventListener('click', function() {
		openInBrowser();
	});
	
	var bottom_spacing = Ti.UI.createView({
		height: (isAndroid) ? 20 : 80,
		width: "100%",
		top: 5
	});
	
	textWrap.add(date_text);
	textWrap.add(title_text);
	textWrap.add(img_view);
	textWrap.add(body_text);
	textWrap.add(read_more);
	textWrap.add(bottom_spacing);
	
	scrollView.add(textWrap);
	
	win.add(scrollView);
	
	if (!isAndroid) {
		Titanium.Admob = Ti.Admob = require('ti.admob');
		var ad;
		
		var shadow = Ti.UI.createView({
			backgroundImage:"images/shadow_u.png",
			height:5,
			width: "100%",
			bottom: 49
		});
		
		win.add(shadow);
		
		win.add(ad = Ti.Admob.createView({
		    bottom: 0, left: 0,
		    width: 400, height: 50,
		    publisherId: 'a14ed1a5ee858ea',
		    adBackgroundColor: 'black',
		    gender: '',
		    keywords: 'cornell, sun, ithaca, college, university'
		}));
	}
}
