const VALID_WIDTH = 800;
const VALID_HEIGHT = 200;
const SUBJECT_TEXT = "Your submission to the Subaru Milestone Project is invalid"
const VALID_FILESIZE = 100000000; //10mb
const VALID_FILESIZE_MB = VALID_FILESIZE / 10000000;
const DEBUG = true;

//required fn for google wep app
function doGet(e) {
    return HtmlService.createHtmlOutputFromFile('upload');
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

        //Creates the file in THIS google drive account. Currently just dumps to root folder but can be changed.
        const file = DriveApp.createFile(blob);

        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const s = ss.getActiveSheet();
        const url = file.getUrl();

        let displayName = params.displayName.toString();
        if (displayName == "")
            displayName = "Not provided";
        let email = params.email.toString();
        if (email == "")
            email = "Not provided";

        let row = [displayName, email, url];
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
