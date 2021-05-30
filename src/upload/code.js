//this is just a backup copy of whatever's on the google sheet
const VALID_WIDTH = 400;
const VALID_HEIGHT = 400;
const SUBJECT_TEXT = "Your submission to the Subaru Milestone Project is invalid";
const DEFAULT_MESSAGE = "Happy birthday and congratulations on 1 million subscribers!";
const VALID_FILESIZE = 100000; //100kb
const VALID_FILESIZE_KB = 1000; //100kb
// const VALID_FILESIZE_MB = VALID_FILESIZE / 10000000;
const DEBUG = true;
const IMAGE_COLUMN = 8;

//The folder where images will go in the GDrive. It is in the last part of the URL when viewing in the browser
const FOLDER_ID = "1x4ErkPqyRwgPn87wGeclYwk1uRY0yy0x";
const TEMPLATE_FILE_ID = "1Tk_dS_ARIBrCmmkx2K1Vmu3RUNmy0czK";
//folder for testing on cheesefoo acc
//const FOLDER_ID = "1ksPbsgK8SoXfWYTx3JVCXJf2P7cJW2kZ";


//required fn for google wep app
function doGet(e) {

    return HtmlService.createHtmlOutputFromFile("upload");
}

//debug fn
function findfolder() {
    const folderIterator = DriveApp.getFolders();
    Logger.log(folderIterator);
    while (folderIterator.hasNext()) {
        const folder = folderIterator.next();
        Logger.log(folder.getName());
        Logger.log(folder.getId());
    }
}

//required fn for google wep app. Is called by html script after clicking submit buttton
function doPost(e) {
    const params = e.parameters;
    if (DEBUG) {

        Logger.log("name: " + params.displayName);
        Logger.log("msg: " + params.message);
        // Logger.log(params.file);
        Logger.log("email: " + params.email);
        Logger.log("discord: " + params.discord);
        Logger.log("sound: " + params.soundSelection);
        Logger.log("uploadMethod: " + params.uploadMethod);
        Logger.log("country: " + params.country);
        Logger.log("referer: " + params.referer);
    }
    const uploadMethod = params.uploadMethod;
    let data, blob;
    if (uploadMethod != "template") {
        data = Utilities.base64Decode(params.data);
        blob = Utilities.newBlob(data, params.mimetype, params.filename);
    }
    let output = "";//HtmlService.createHtmlOutput("Something happened");
    if (uploadMethod == "upload") {
        if (!isImageValid(blob)) {
            output = failureText();
            output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
            return output;
        }
    }
    let displayName = params.displayName.toString();

    if (displayName == "")
        displayName = MakeDefaultName();

    let message = params.message.toString();
    if (message == "")
        message = DEFAULT_MESSAGE;

    let canContact = params.canContact.toString();
    let email, discord, country, referer;
    if (canContact == "yes") {
        email = params.email.toString();
        discord = params.discord.toString();
    }
    if (email == "")
        email = "Not provided";

    if (discord == "")
        discord = "Not provided";

    if (country == "")
        country = "Not Provided";
    country = params.country.toString();
    referer = params.referer.toString();
    if (referer == "other")
        referer = params.refererOther.toString();

    //create a unique filename
    const timestamp = new Date();
    // timestamp = timestamp.setNumberFormat("yyyy-MM-dd HH:mm:ss");

    let sound = params.soundSelection.toString();
    let fileId,filename;

    //Creates the file in the google drive account under which the deployment is executed as.
    if (uploadMethod == "template") {
        fileId = TEMPLATE_FILE_ID;
        filename = "TEMPLATE"
    } else{
        let file = DriveApp.createFile(blob);
        file = file.setName(filename);
        const folder = DriveApp.getFolderById(FOLDER_ID);
        file.moveTo(folder);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileId = file.getId();
        filename = MakeFileName(displayName, timestamp);
    }
    let fileUrl = "https://drive.google.com/uc?export=view&id=" + fileId;


    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const s = ss.getActiveSheet();
    // let row = [timestamp, displayName, email, url, filename];
    let row = ["", displayName, email, discord, fileUrl, filename, message, sound, "", "", "", country, referer];
    s.appendRow(row);
    let rowNum = s.getLastRow();

    // s.insertImage(blob,5,rowNum);
    let cell = s.getRange(rowNum, 1);
    cell.setValue(new Date()).setNumberFormat("yyyy/mm/dd-HH:mm:ss");
    output = successText();
    if (DEBUG) {
        Logger.log("was valid");
        Logger.log(row);
    }

    output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return output;
}

//create html output for success. currently simple.
function successText() {
    const txt = "Upload successful!";
    let successHtml = HtmlService.createTemplateFromFile("successful");
    let ret = successHtml.getRawContent().replace("{{message}}", txt);
    let template = HtmlService.createTemplate(ret);
    return template.evaluate();
}

//create html output for failure. currently simple.
function failureText() {
    const errText = "The image dimensions of your submission must be " + VALID_WIDTH + "x" + VALID_HEIGHT + " and less than " + VALID_FILESIZE_KB + "kb." +
        "\nIf you have questions please contact us on discord.";
    let errHtml = HtmlService.createTemplateFromFile("successful");
    let ret = errHtml.getRawContent().replace("{{message}}", errText);
    let template = HtmlService.createTemplate(ret);
    return template.evaluate();
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
    const hash = (displayName + timestamp).hashCode() * 297;
    const hashstr = hash.toString().substring(0, 6);
    const sanitizedName = displayName.replace(/[<>:"/\\|?*]/g, "");

    const filename = sanitizedName + "-" + hashstr;
    Logger.log("Filename: " + filename);

    return filename;
}

//https://stackoverflow.com/questions/194846/is-there-any-kind-of-hash-code-function-in-javascript
String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
        const character = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

const ID_LENGTH = 4;

// Thanks to Tom Spencer for this function
// Tom's website/blog is at fiznool.com
function generateUID() {
    const ALPHABET = "0123456789";
    let rtn = "";
    for (let i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
}

//Resize all cells to fit the spritesheet
function autoresizeCells() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    let rowNum = ss.getLastRow();
    let colNum = ss.getLastColumn();
    sheet.autoResizeRows(2, rowNum - 1);
    sheet.autoResizeColumns(2, colNum - 1);
}

function resizeCellsToTemplateSize() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    let rowNum = ss.getLastRow();
    let colNum = ss.getLastColumn();
    sheet.setRowHeights(2, rowNum - 1, VALID_HEIGHT);
    sheet.setColumnWidth(5, VALID_WIDTH);
}

function MakeDefaultName() {
    let id = generateUID();
    return "Subatomo#" + id;
}
