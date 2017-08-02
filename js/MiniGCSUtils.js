// START CODE for "copyexternalkblink"

function createExternalURL() {
	chrome.tabs.executeScript({file: "js/CopyLinkInject.js"});
}

// END CODE for "copyexternalkblink"



// START CODE for "gotoexternalkblink"

function gotoexternalkblink() {
	chrome.tabs.executeScript({file: "js/OpenExternalKB.js"});
}

function openExternalKBNewTab(urlKB) {
	chrome.tabs.create({url: urlKB});
}

// END CODE for "gotoexternalkblink"

// START CODE for "copycasedirectory"

function copyCaseDirectory() {
		chrome.tabs.executeScript({file: "js/jquery-3.1.1.min.js"}, function(){
            chrome.tabs.executeScript({file: "js/CopyCaseDirectoryInject.js"});
        });
    }

// END CODE for "copycasedirectory"


// START CODE GENERIC

function issueUserNotificationsCaseDirectoryRelated(status, directory, error) {
	if(status == 'Success') {
		var successNotification = chrome.notifications.create('successnotification', {
			type: "basic",
			title: "Success",
			iconUrl: 'images/success.png',
			message: "Directory Copied"+"\n"+directory}, function (notificationId) {});
			
		setTimeout(function(){
			chrome.notifications.clear('notification');
		},4000);
	}
	else {
		var failureNotification = chrome.notifications.create('failurenotification', {
			type: "basic",
			title: "Failure",
			iconUrl: 'images/fail.png',
			message: "Unable to copy!!"+"\n"+error}, function (notificationId) {});
			
		setTimeout(function(){
			chrome.notifications.clear('notification');
		},4000);
	}
}




function issueUserNotificationsKBRelated(access, urlKB) {
	if(access == 'Public') {
		var successNotification = chrome.notifications.create('successnotification', {
			type: "basic",
			title: "Success",
			iconUrl: 'images/success.png',
			message: "URL Copied"+"\n"+urlKB}, function (notificationId) {});
			
		setTimeout(function(){
			chrome.notifications.clear('notification');
		},4000);
	}
	else {
		var failureNotification = chrome.notifications.create('failurenotification', {
			type: "basic",
			title: "Failure",
			iconUrl: 'images/fail.png',
			message: "Internal KB!! \nNo External URL"}, function (notificationId) {});
			
		setTimeout(function(){
			chrome.notifications.clear('notification');
		},4000);
	}
}

// Create context Menus for all the utilities here

function createContextMenus() {
	
	var menus = [];
	
	var ADMINCONSOLE_AUTO_FILL = {
		"title": 						"Ambari Console Auto Fill",
		"contexts":						["page"],
		"id":							"adminconsoleautofill",
		"documentUrlPatterns":			["https://*/#/login", "http://*/#/login", "https://*/*","http://*/*"]
	};
	
	var COPY_EXTERNAL_KB_LINK = {
		"title":						"Copy External KB Link",
		"contexts":						["page"],
		"id":							"copyexternalkblink",
		"documentUrlPatterns":			["http://psv28cmsmas1:7000/*"]
	};
	
	var GOTO_EXTERNAL_KB_LINK = {
		"title":						"GOTO External KB Link",
		"contexts":						["page"],
		"id":							"gotoexternalkblink",
		"documentUrlPatterns":			["http://psv28cmsmas1:7000/*"]
	};	

	var COPY_CASE_DIRECTORY = {
		"title":						"Copy Case Directory",
		"contexts":						["page"],
		"id":							"copycasedirectory",
		"documentUrlPatterns":			["https://informatica.my.salesforce.com/*"]
	};
	
	// Add the new Menu Item Here
	//
	//
	
	// Push the new menu item in menus Array
	
	menus.push(ADMINCONSOLE_AUTO_FILL,COPY_EXTERNAL_KB_LINK,GOTO_EXTERNAL_KB_LINK,COPY_CASE_DIRECTORY);
	
	for(var i = 0; i < menus.length; i++)
		chrome.contextMenus.create(menus[i]);
	
}


function callback(info) {
	switch(info.menuItemId) {
		
		case 'adminconsoleautofill' : 	chrome.tabs.executeScript({
										code: 'document.getElementsByClassName("login-user-name")[0].focus(); document.getElementsByClassName("login-user-name")[0].value = "admin" ; document.getElementsByClassName("login-user-password")[0].focus(); document.getElementsByClassName("login-user-password")[0].value = "admin"'});
										break;
		
		case 'copyexternalkblink' 	:	createExternalURL();
										break;
									
		case 'gotoexternalkblink' : 	gotoexternalkblink();
										break;

		case 'copycasedirectory':		copyCaseDirectory();
										break;
	}
}

// Start listening for Messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if(request.access == 'Public' || request.access == 'Internal') {
			issueUserNotificationsKBRelated(request.access, request.urlKB);
		}
		if(request.accessOpenExternalKB == 'Public') {
			openExternalKBNewTab(request.urlKB);
		}
		if(request.accessOpenExternalKB == 'Internal') {
			issueUserNotificationsKBRelated(request.accessOpenExternalKB)
		}
		if(request.directoryCopied == 'YES') {
			issueUserNotificationsCaseDirectoryRelated('Success', request.directory);
		}
		if(request.directoryCopied == 'NO') {
			issueUserNotificationsCaseDirectoryRelated('Failure', request.directory, request.errorMessage);
		}
	});

// Create the context menu as soon as the plugin is installed or updated	
chrome.runtime.onInstalled.addListener(createContextMenus);

// Actions to perform as soon as a contextMenu item is clicked
chrome.contextMenus.onClicked.addListener(callback);

// END CODE GENERIC