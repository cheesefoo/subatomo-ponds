let strings;

$(window).on("load", function () {

    loadJSON(function (response) {
        strings = JSON.parse(response);
    });
});
//localStorage["userLang"]="en";
let lang;
if (localStorage.getItem("userLang") === null) {
    lang = "en";
} else {
    lang = localStorage["userLang"];
}

function loadJSON(callback) {

    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "languages.json", true);

    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {

            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
