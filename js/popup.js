function saveCaseDirectory() {
	var caseDirectory = document.getElementById("casedirectory").value;
	console.log(caseDirectory);
	if(caseDirectory == "") {
		document.getElementById('directoryresult').innerHTML = 'Cannot be empty!';
	} else {
		chrome.storage.local.set({'caseDirectory': caseDirectory});
		document.getElementById('directoryresult').innerHTML = 'Good';
	}
}

function getCaseDirectory() {
	chrome.storage.local.get('caseDirectory', function(result) {
		var caseDir = result.caseDirectory;
		console.log(caseDir);
		document.getElementById('currentcasedirectory').innerHTML = caseDir;
	});
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('savecasedirectory').addEventListener('click',saveCaseDirectory);
	document.getElementById('getcasedirectory').addEventListener('click',getCaseDirectory);
});