let strings;
let lang;

$(function () {
    console.log("language load in rdy");


});

function getLang() {
    if (localStorage.getItem("userLang") == null) {
        lang = "EN";
    } else {
        lang = localStorage["userLang"];
    }
}

async function loadJSON() {
    await fetch("localization/languages.json")
        .then(response => response.json())
        .then(data => strings = data)
        // .then(getLang)
        .catch(err => console.log(err));
    // let xobj = new XMLHttpRequest();
    // xobj.overrideMimeType("application/json");
    // xobj.open("GET", "localization/languages.json", true);
    //
    // xobj.onreadystatechange = function () {
    //     if (xobj.readyState == 4 && xobj.status == "200") {
    //
    //         callback(xobj.responseText);
    //     }
    // };
    // xobj.send(null);
}
