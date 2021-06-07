let spritesheet = new Image();

const uploadFile = document.getElementById("uploadFile");
uploadFile.onchange = function () {
    chooseFile(this.files[0]);
};

function chooseFile(file) {
    const reader = new FileReader();
    // const file = this.files[0];
    if (file) {
        reader.addEventListener("load", function (e) {
            spritesheet.src = reader.result;
            canvas1.style.visibility = "visible";
            canvas2.style.visibility = "visible";
            canvas1Flipped.style.visibility = "visible";
            canvas2Flipped.style.visibility = "visible";
            startAnimating(10);

            //todo: check image dimensions?
        }, false);
        reader.readAsDataURL(file);
    }
}

let fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation
function startAnimating(fps) {
    console.log("start animating");
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

let w = 200;
let h = 200;
let sx1, sy1, sx2, sy2 = 0;
let scale = 1;
let canvas1 = document.getElementById("animPreview1");
let canvas2 = document.getElementById("animPreview2");
let canvas1Flipped = document.getElementById("animPreview1-flipped");
let canvas2Flipped = document.getElementById("animPreview2-flipped");
// let canvas = document.querySelector("#animPreview");
let canvasContext1 = canvas1.getContext("2d");
let canvasContext2 = canvas2.getContext("2d");
let canvasContext1Flipped = canvas1Flipped.getContext("2d");
let canvasContext2Flipped = canvas2Flipped.getContext("2d");

let currentFrame1 = 0;
let currentFrame2 = 0;
const framesInAnimation1 = 4;
const framesInAnimation2 = 2;

function animate() {

    // request another frame

    // console.log(currentFrame);
    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        canvasContext1.clearRect(0, 0, canvas1.width, canvas1.height);
        canvasContext2.clearRect(0, 0, canvas2.width, canvas2.height);
        canvasContext1Flipped.clearRect(0, 0, canvas1Flipped.width, canvas1Flipped.height);
        canvasContext2Flipped.clearRect(0, 0, canvas2Flipped.width, canvas2Flipped.height);

        //Set corner coordinates according to current frame
        //   x  y
        // 0 0  0
        // 1 w  0
        // 2 0  0
        // 3 0  h
        sx1 = currentFrame1 != 1 ? 0 : w;
        sy1 = currentFrame1 != 3 ? 0 : h;
        // sx = currentFrame % 2 === 0 ? 0 : w;
        // sy = currentFrame < 2 ? 0 : h;

        sx2 = currentFrame2 === 0 ? 0 : w;
        sy2 = currentFrame2 === 0 ? 0 : h;
        // console.log(currentFrame + ":" + sx + "x" + sy);
		
		

        canvasContext1.drawImage(spritesheet, sx1, sy1, w, h, 0, 0, w * scale, h * scale);
        canvasContext2.drawImage(spritesheet, sx2, sy2, w, h, 0, 0, w * scale, h * scale);
        canvasContext1Flipped.drawImage(spritesheet, sx1, sy1, w, h, 0, 0, w * scale, h * scale);
        canvasContext2Flipped.drawImage(spritesheet, sx2, sy2, w, h, 0, 0, w * scale, h * scale);


        currentFrame1++;
        currentFrame2++;
        if (currentFrame1 == framesInAnimation1)
            currentFrame1 = 0;
        if (currentFrame2 == framesInAnimation2)
            currentFrame2 = 0;
    }
}

$("#uploadFile").on("change", function () {
    try {
        document.getElementById("raw-sbm").remove();
        document.getElementById("mime-sbm").remove();
        document.getElementById("filetype-sbm").remove();
    } catch (e) {
    }
    const file = this.files[0];
    const fr = new FileReader();
    fr.fileName = file.name;
    fr.onload = function (e) {
        e.target.result;
        html = "<input type=\"hidden\" name=\"data\" id=\"raw-sbm\" value=\"" + e.target.result.replace(/^.*,/, "") + "\" >";
        html += "<input type=\"hidden\" name=\"mimetype\" id=\"mime-sbm\" value=\"" + e.target.result.match(/^.*(?=;)/)[0] + "\" >";
        html += "<input type=\"hidden\" name=\"filename\" id=\"filename-sbm\" value=\"" + e.target.fileName + "\" >";
        // $("#data").empty().append(html);
        $("#data").append(html);
    };
    fr.readAsDataURL(file);
});

const audio = document.getElementById("player");
const source = document.getElementById("mp3_src");


let soundmap;


function makeSoundButtons() {
    console.log(soundmap);

    let options = $("#soundSelection");
    let container = $("#soundButtons");

    //The index of the localized string in languages.json, after "Picked Randomly"
    let soundStringIndex = 14;


    let len = soundmap.sounds.length;
    for (let i = 0; i < len; i++) {
        let sound = soundmap.sounds[i];
        let txt = sound.replace(".mp3", "");
        let l18nStrIndex = i + soundStringIndex;
        options.append(`<option class='soundOption' value="${i}" text="u-${l18nStrIndex}">${txt}</option>`);
        container.append(`<button class='soundButton' type='button' value="${i}" text="u-${l18nStrIndex}">${txt}</button>`);
    }

}
$("#soundSelection").on("change", function () {
    let f = $(this).val();
    console.log(f);
    play(f);
});

$(".soundButton").on("click", function () {
    let f = $(this).attr("value");
    console.log(f);
    play(f);
});

async function loadsounds() {
    await fetch("soundfilemap.json")
        .then(response => response.json())
        .then(data => soundmap = data)
        .catch(err => console.log(err));
}

function play(val) {
    if (val === -1)
        val = getRandomIntInclusive(0, soundmap.sounds.length - 1);
    let src = soundmap.sounds[val];
    console.log(src);
    audio.src = "./" + src;
    audio.load();
    audio.play();
}

/*
function fetchVideoAndPlay(src) {
    fetch(src)
        .then(response => response.blob())
        .then(blob => {
            audio.src = blob;
            return audio.play();
        })
        .then(_ => {
            // Video playback started ;)
        })
        .catch(e => {
            console.log(e);
        });
}
*/


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// $(window).on("load",function () {
//     let player = document.getElementById("mp3_src");
//     let options = $("select").children();
//     let len = options.length;
//     let container = $("#soundButtons");
//     for (let i = 0; i < len; i++) {
//         let txt = options[i].value;
//         container.append(`<button class='soundButton' id='${txt}' type='button' onclick="document.getElementById('mp3_src').src='./${txt}.mp3'">${txt}</button>`);
//     }

// });
// let btns = document.getElementsByClassName(".soundButton");
// btns.forEach(btn => btn.addEventListener("click", onButtonClick));
// $(".soundButton").on("click", function () {
//     let name = $(this).val();
//     let src = `./${name}`;
//     play(src);
// }));
