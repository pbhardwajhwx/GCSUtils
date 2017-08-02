/* As there is no straightforward way to copy the content to windows clipboard 
I am creating a temporary element in the HTML page, 
writing the URL there, copying it to clipboard and then removing it. */

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}



function clean(dirty) {
    return dirty.replace(/[\[\]\/(){}?*+\^\&$\\.|\-\:\"]/g, "");
}

$.expr[":"].textEquals = function(a, i, m) {
    return $(a)
        .text()
        .match("^" + m[3] + "$");
};

var getCaseNum = function() {
    var $selChild = getCurrentCasePanel();
    var caseNum = $selChild.find(".sd_secondary_container")
        .not(".x-hide-display")
        .find("iframe:first")
        .contents()
        .find(".mainContent")
        .find(".pbSubsection")
        .find("td:textEquals('Case Number')")
        .parent()
        .find("td:eq(1)")
        .text();
    caseNum = caseNum.replace("[View Hierarchy]", "");
    console.log(caseNum);
    return caseNum;
}

var getSubject = function() {

    var $selChild = getCurrentCasePanel();
    var subject = $selChild.find(".sd_secondary_container")
        .not(".x-hide-display")
        .find("iframe:first")
        .contents()
        .find(".mainContent")
        .find(".pbSubsection")
        .find("td:textEquals('Subject')")
        .parent()
        .find("td:eq(1)")
        .children()
        .text();

    console.log(subject);
    subject = subject.slice(0, 50);
    console.log(subject);
    var cleanSubject = clean(subject);
    return cleanSubject;

}

var getAccountName = function() {
    var $selChild = getCurrentCasePanel();
    var accountName = $selChild.find(".sd_secondary_container")
        .not(".x-hide-display")
        .find("iframe:first")
        .contents()
        .find(".mainContent")
        .find(".pbSubsection")
        .find("td:textEquals('Account Name')")
        .parent()
        .find("td:eq(3)")
        .text();
    accountName = accountName.replace("[View Hierarchy]", "");
    console.log(accountName);
    var cleanAccountName = clean(accountName);
    return cleanAccountName;
}

var getCaseDirectory = function() {
    
    chrome.storage.local.get('caseDirectory', function(result) {
        try {
            var caseDir = result.caseDirectory;
            var finalCaseDirectory = "\"" + caseDir + "\\" + getCaseNum() + "_" + getAccountName() + "_" + getSubject() + "\"";
            copyTextToClipboard(finalCaseDirectory);
        } catch (err) {
            chrome.runtime.sendMessage({ directoryCopied: "NO", directory: finalCaseDirectory, errorMessage: e }, {}, function() {});
        }
        chrome.runtime.sendMessage({ directoryCopied: "YES", directory: finalCaseDirectory }, {}, function() {});
        //console.log(caseDir);
    });

}

var getCurrentCasePanel = function() {
    var $selChild;
    try {
        $selChild = $(".sd_nav_tabpanel_body")
            .children("div")
            .not(".x-hide-display");

    } catch (err) {
        console.log("Error while reading content" + err);
        return null;
    }
    return $selChild;

}

getCaseDirectory();