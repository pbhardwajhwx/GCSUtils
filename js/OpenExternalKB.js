function isPublic() {
	var cellVal=null;
    var oTable = document.getElementById('KBMetaDataTable');
	var PUBLIC_REGEX = /^Public$/;
	var publicAccess = false;
	
    //gets rows of table
    var rowLength = oTable.rows.length;

    //loops through rows    
    for (i = 0; i < rowLength; i++){

      //gets cells of current row  
       var oCells = oTable.rows.item(i).cells;

       //gets amount of cells of current row
       var cellLength = oCells.length;

       //loops through each cell in current row
       for(var j = 0; j < cellLength; j++){

              // get your cell info here	
              cellVal = oCells.item(j).innerText;
			  publicAccess = PUBLIC_REGEX.test(cellVal);
			  if(publicAccess) {
				  return true;
			  }
           }
    }
	return false;
}

if(isPublic()) {
	var PRE_URL = "http://kb.informatica.com";
	var postURL = document.getElementById("ctl00_PlaceHolderMain_hl_current_doc").innerText;
	var externalURL = PRE_URL+postURL;
	console.log(externalURL);
	chrome.runtime.sendMessage({accessOpenExternalKB: "Public", urlKB: externalURL},{},function(){});
} else {
	chrome.runtime.sendMessage({accessOpenExternalKB: "Internal", urlKB: null},{},function(){});
}