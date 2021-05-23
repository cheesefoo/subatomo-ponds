let strings;
let lang;
let codes;

// $(function () {
//     loadJSON().catch(console.error);
//     console.log("language load in languagejs");
// });

function getLang() {
    if (localStorage.getItem("userLang") == null) {
        lang = "EN";
    } else {
        lang = localStorage["userLang"];
    }
}

async function loadCountryCodesJSON() {
    await fetch("localization/countrycodes.json")
        .then(response => response.json())
        .then(data => codes = data)
        .catch(err => console.log(err));
}


async function loadTranslationsJSON() {
    await fetch("localization/languages.json")
        .then(response => response.json())
        .then(data => strings = data)
        .then(getLang)
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
