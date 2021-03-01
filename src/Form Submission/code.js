const VALID_WIDTH = 200;
const VALID_HEIGHT = 200;
const SUBJECT_TEXT = "Your submission to the Subaru Milestone Project is invalid"
const VALID_FILESIZE = 100000000; //10mb
const VALID_FILESIZE_MB = VALID_FILESIZE / 10000000;
const DEBUG = true;

//The folder where images will go in the GDrive. It is in the last part of the URL when viewing in the browser
const FOLDER_ID = "1djXJhshgjRbidvAeOXrfA3k3Cbi0XkCQ";
//folder for testing on cheesefoo acc
//const FOLDER_ID = "1ksPbsgK8SoXfWYTx3JVCXJf2P7cJW2kZ";


//required fn for google wep app
function doGet(e) {

    return HtmlService.createHtmlOutputFromFile('upload');
}

//debug fn
function findfolder() {
    const folderIterator = DriveApp.getFolders();
    Logger.log(folderIterator);
    while (folderIterator.hasNext()) {
        var folder = folderIterator.next();
        Logger.log(folder.getName());
        Logger.log(folder.getId());
    }
}

//required fn for google wep app. Is called by html script after clicking submit buttton
function doPost(e) {
    const params = e.parameters;
    if (DEBUG) {
        Logger.log(e.parameters);
        Logger.log(params.displayName);
        Logger.log(params.file);
        Logger.log(params.email);
    }
    const data = Utilities.base64Decode(params.data);
    const blob = Utilities.newBlob(data, params.mimetype, params.filename);
    let output = "";//HtmlService.createHtmlOutput("Something happened");

    if (isImageValid(blob)) {
        let displayName = params.displayName.toString();
        if (displayName == "")
            displayName = "Not provided";
        let email = params.email.toString();
        if (email == "")
            email = "Not provided";

        //create a unique filename
        var timestamp = new Date();
        timestamp = timestamp.toUTCString();
        var filename = MakeFileName(displayName, timestamp);

        //Creates the file in the google drive account under which the deployment is executed as.
        var file = DriveApp.createFile(blob);
        file = file.setName(filename);
        const folder = DriveApp.getFolderById(FOLDER_ID);
        file.moveTo(folder);


        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const s = ss.getActiveSheet();
        const url = file.getUrl();


        let row = [timestamp, displayName, email, url, filename];
        s.appendRow(row);
        output = successText();
        if (DEBUG) {
            Logger.log("was valid");
            Logger.log(row);
        }
    } else {
        if (DEBUG) {
            Logger.log("wasnt valid");
        }
        output = failureText();
    }

    output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return output;
}

//create html output for success. currently simple.
function successText() {
    return HtmlService.createHtmlOutput("Done!");
}

//create html output for failure. currently simple.
function failureText() {
    const errText = "The image dimensions of your submission must be " + VALID_WIDTH + "x" + VALID_HEIGHT + " and less than " + VALID_FILESIZE_MB + "mb."
    ". Please use the provided template. If you have questions please contact us on discord.";

    return HtmlService.createHtmlOutput(errText);
}


//checks if image is the correct dimensions and filesize
//blob -> bool
function isImageValid(blob) {

    //use ImgApp to determine dimensions
    const res = ImgApp.getSize(blob);
    const width = res.width;
    const height = res.height;

    const fileSize = blob.getBytes().length;
    const validSize = fileSize <= VALID_FILESIZE;
    const validDimensions = (width == VALID_WIDTH) && (height == VALID_HEIGHT);
    const validSubmission = validDimensions && validSize;
    if (DEBUG) {
        Logger.log(fileSize);
        Logger.log(width + "x" + height + ", " + fileSize);
    }
    return validSubmission;

}

//sends automated email to provided address. currently, invalid submissions are rejected so this isn't needed
function sendErrorEmail(email) {
    const bodyText = "The image dimensions of your submission must be " + VALID_WIDTH + "x" + VALID_HEIGHT + ". Please use the provided template. If you have questions please contact us on discord.";
    if (email == null)
        return;
    GmailApp.sendEmail(email, SUBJECT_TEXT, bodyText);
}


//Create a 'unique' filename out of a hash, deletes NTFS invalid chars
function MakeFileName(displayName, timestamp) {
    var hash = (displayName + timestamp).hashCode() * 297;
    var hashstr = hash.toString().substring(0, 6);
    var sanitizedName = displayName.replace(/[<>:"/\\|?*]/g, "");

    var filename = sanitizedName + "-" + hashstr;
    Logger.log("Filename: " + filename);

    return filename;
}

//https://stackoverflow.com/questions/194846/is-there-any-kind-of-hash-code-function-in-javascript
String.prototype.hashCode = function () {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
