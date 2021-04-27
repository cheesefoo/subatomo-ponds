function importAll(r) {
    return r.keys().map(r);
}

importAll(require.context('../assets/sound/', true, /suba.*\.mp3/));
// const su1 = require('../assets/sound/suba_1.mp3');
// const su2 = require('../assets/sound/suba_2.mp3');
const soundMap = require('./soundfilemap.json');
// Dropzone.options.form = {
//     paramName: "file", // The name that will be used to transfer the file
//     maxFilesize: 2, // MB
//     accept: function (file, done) {
//         chooseFile(file)
//     }
// };

function disallowedChars(e) {
    let regex = new RegExp(escapeRegExp('<>:"/\\|?*'));
    return regex.test(e.charCode);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function yesCheck() {
    let email = document.getElementById('emailInput');
    let discord = document.getElementById('discordInput');
    let style = document.getElementById('radioYes').checked ? 'block' : 'none';
    email.style.display = style;
    discord.style.display = style;
}

let spritesheet = new Image();

const uploadFile = document.getElementById("uploadFile");
uploadFile.onchange = function () {
    chooseFile(this.files[0])
};

function chooseFile(file) {
    const reader = new FileReader();
    // const file = this.files[0];
    if (file) {
        reader.addEventListener("load", function (e) {
            spritesheet.src = reader.result;
            canvas1.style.visibility = "visible";
            canvas2.style.visibility = "visible";
            startAnimating(10);

            //todo: check image dimensions?
        }, false);
        reader.readAsDataURL(file);
    }
}

let fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation
function startAnimating(fps) {
    console.log("start animating")
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

let w = 100;
let h = 100;
let sx1, sy1, sx2, sy2 = 0;
let scale = 1;
let canvas1 = document.getElementById("animPreview1");
let canvas2 = document.getElementById("animPreview2");
// let canvas = document.querySelector("#animPreview");
let canvasContext1 = canvas1.getContext("2d");
let canvasContext2 = canvas2.getContext("2d");

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
        sy2 = currentFrame2 === 0 ? 0 : h
        // console.log(currentFrame + ":" + sx + "x" + sy);

        canvasContext1.drawImage(spritesheet, sx1, sy1, w, h, 0, 0, w * scale, h * scale);
        canvasContext2.drawImage(spritesheet, sx2, sy2, w, h, 0, 0, w * scale, h * scale);
        currentFrame1++;
        currentFrame2++;
        if (currentFrame1 == framesInAnimation1)
            currentFrame1 = 0;
        if (currentFrame2 == framesInAnimation2)
            currentFrame2 = 0;
    }
}

$('#uploadFile').on("change", function () {
    try {
        document.getElementById('raw-sbm').remove();
        document.getElementById('mime-sbm').remove();
        document.getElementById('filetype-sbm').remove();
    } catch (e) {
    }
    const file = this.files[0];
    const fr = new FileReader();
    fr.fileName = file.name;
    fr.onload = function (e) {
        e.target.result
        html = '<input type="hidden" name="data" id="raw-sbm" value="' + e.target.result.replace(/^.*,/, '') + '" >';
        html += '<input type="hidden" name="mimetype" id="mime-sbm" value="' + e.target.result.match(/^.*(?=;)/)[0] + '" >';
        html += '<input type="hidden" name="filename" id="filename-sbm" value="' + e.target.fileName + '" >';
        // $("#data").empty().append(html);
        $("#data").append(html);
    }
    fr.readAsDataURL(file);
});

const audio = document.getElementById("player");
const source = document.getElementById("mp3_src");

$('#soundSelection').on('change', function () {
    change($(this).val());
});


function change(index) {
    // audio.pause();
    if (index !== 'random') {
        source.src = soundMap.sounds[parseInt(index) - 1];
        audio.load();
        audio.play();
    }
}
