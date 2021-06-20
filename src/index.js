let DEBUGGING = false;
let TEST_DATA = false;

require("./assets/css/modal.css");
require("./assets/css/dropdown-img.css");
require("./assets/css/style.css");
require("./assets/css/credits.css");
require("./assets/images/intro/loading.gif");
require("./assets/images/subahug3.png");
require("./assets/images/thewholesky.jpg");
require("./assets/images/subatomo army.png");
require("./assets/images/ui/volume.png");
require("./assets/images/ui/volume_mute.png");


function importAll(r) {
    return r.keys().map(r);
}

let ducksj, submissions;

// if (TEST_DATA) {
//     ducksj = require("./assets/test_submissions/all_ducks_sheet.json");
//     submissions = require("./assets/test_submissions/submissions.json");
//     importAll(require.context("./assets/test_submissions", true, /all_ducks_sheet.*\.(png|jpe?g|svg)$/));
// } else {
//
// }
ducksj = require("./assets/submissions/all_ducks_sheet.json");
submissions = require("./assets/submissions/submissions.json");
importAll(require.context("./assets/submissions", true, /all_ducks_sheet.*\.(png|jpe?g|svg)$/));


const legsj = require("./assets/Duck Templates Resized/Duck Leg Cut/legs/legs.json");
const splashj = require("./assets/pond/WaterSplashAnimation/splash.json");
// const pondTileJson = require("./assets/pond/pond_isometric.json");
// const pondTileJson = require("./assets/pond/pond.json");
const pondTileJson = require("./assets/pond/pond.json");
const soundsj = require("./assets/sound/soundfilemap.json");

window.logSwim = true;

require("phaser");
// const NineSlicePlugin = require("phaser3-nineslice");
import {Plugin as NineSlicePlugin} from "phaser3-nineslice";

// require("./assets/Subapond vibrant/water_vibrant_1920x1080.png");
// require("./assets/Subapond vibrant/grass_vibrant_1920x1080.png");
// require("./assets/pond/pond_vibrant_1920x1080.jpg");
require("./assets/pond/Subapond_vibrantHD-min.jpg");
require("./assets/pond/pond_color_invert.png");
require("./assets/pond/WaterSplashAnimation/splash.png");
require("./assets/images/ui/subaru_uitest_1.png");


importAll(require.context("./assets/Duck Templates Resized/Duck Leg Cut/legs/", true, /legs.*\.(png|jpe?g|svg)$/));
importAll(require.context("./", true, /pond.*\.(json)$/));
importAll(require.context("./assets/sound/", true, /.*\.(mp3|ogg|wav)$/));
//Tile indices corresponding to water tiles in Tiled .tmx file
// const pondTileIndices = [36, 37, 38, 39, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 63, 64, 65, 66, 67, 68, 69,
//     70, 71, 72, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 94, 95, 96,];
// const groundTileIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
//     26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 44, 58, 59, 60, 61, 62, 73, 74, 75, 76, 77, 88, 89, 90, 91,
//     92, 93, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,];

//ORTHOGNAL
let groundTileIndices = [1, 2, 3, 4, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 44, 45, 46, 47, 48, 51, 63, 64, 80, 81, 82, 83, 96, 97, 98, 99, 111, 112, 114, 115, 116, 121, 122, 123, 124, 125, 126, 127, 128, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142];
let pondTileIndices = [40, 41, 42, 53, 56, 57, 58, 59, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 101, 102, 103, 104, 105, 106, 107, 108];
let obstacleTileIndices = [5, 6, 7, 8, 11, 16, 24, 25, 26, 32, 60, 61, 62, 67, 109, 110, 113, 129, 130, 143, 144];
let transitionTileIndices = [39, 43, 49, 50, 52, 54, 55, 65, 66, 79, 95, 100, 117, 118, 119, 120];
//ISOMETRIC
// let groundTileIndices = [1, 2, 3, 4, 5, 11, 12, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 66, 67, 68, 77, 78, 79, 83, 84, 98, 99, 118, 119, 121, 122, 123, 124, 138, 139, 141, 142, 143, 144, 158, 159, 161, 162, 163, 164, 177, 178, 179, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197];
// let pondTileIndices = [49, 69, 70, 71, 72, 73, 74, 81, 82, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 101, 102, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174];
// let obstacleTileIndices = [0,6,7,8,9,10,13,19,30,31,39,50,51,52,53,75,76,103,104,175,176,199,200];

let pondLayer, groundLayer, obstacleLayer, transitionLayer;
let grassVibrant, waterVibrant;

//number of frames to wait before each collision check
const COLLISION_CHECK_RATE = 10;
let last_collision_check = 0;

const FRAME_RATE = 10;
const USERNAME_DISPLAY_DURATION = 10000;
const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const maxPond = submissions.submissions[submissions.submissions.length - 1].pond;
const QUACK_DURATION = 9000;

let sceneWidth = innerWidth;
let sceneHeight = innerHeight;


const MIN_TRAVEL = 1000;
const MAX_TRAVEL_TIME = 5000;
const MAX_TRAVEL_DIST_X = sceneHeight / 8;
const MAX_TRAVEL_DIST_Y = sceneWidth / 8;
const WALK_SPEED = 100;
const MIN_IDLE_TIME = 0;
const MAX_IDLE_TIME = 5000;


//the width of the panel
const TEXT_PADDING_CONFIG = {left: 5, right: 20, top: 5, bottom: 10};
const WORD_WRAP_CONFIG = {width: 370, useAdvancedWrap: true};
const MSG_TEXT_CONFIG = {
    fontFamily: "Nodo Sans JP",
    fontSize: "14px",
    color: "#000",
    stroke: "#FCD73F",
    strokeThickness: 2,
    padding: TEXT_PADDING_CONFIG,
    wordWrap: WORD_WRAP_CONFIG
};

let currentPond = 1;

let currentPondPagination = 0;
let pondsPerPage = 6;
let maxPages;

let isEnteringPond = false;

const DUCK_STATES = {
    START_IDLE: 0,
    IDLE: 1,
    START_WALKING: 2,
    WALKING: 3,
    START_QUACK: 4,
    QUACK: 5,
    START_SWIM_IDLE: 6,
    SWIM_IDLE: 7,
    START_SWIMMING: 8,
    SWIMMING: 9,
    START_SWIM_QUACK: 10,
    SWIM_QUACK: 11,
};

let $body = $("body");

function startHomepageAnimation() {
    $("#home").show();
    gsap.set(".modal-window", {visibility: "inherit", delay: 5});
    let tl = gsap.timeline();

    if (innerWidth > 900) {
        tl.fromTo(".logo-panel", {
            autoAlpha: 0,
            opacity: 0,
            x: "-100%"
        }, {
            autoAlpha: .75,
            opacity: .75,
            x: 0,
            duration: 3,
            delay: 5
        }, 0);
        let o = gsap.timeline();
        o.fromTo(".logo-panel", {opacity: 1, duration: .25}, {opacity: .75, duration: .25});

        function opacitytransition() {
            o.reversed(!o.reversed());

        }

        $(".logo-panel")[0].addEventListener("mouseenter", opacitytransition);
        $(".logo-panel")[0].addEventListener("mouseleave", opacitytransition);
    }

    tl.from(".logo-bg", {
        autoAlpha: 0,
        duration: 3
    }, 0);
    tl.fromTo(".logo-front", {
        autoAlpha: 0,
        opacity: 0,
        bottom: "200%"
    }, {
        autoAlpha: 1,
        opacity: 1,
        bottom: 0,
        duration: 1,
        delay: 1
    }, 0);

    tl.fromTo(".logo-mid", {

        bottom: "-200%",
        delay: 0.5,
    }, {
        bottom: "0%",
        duration: 3,
        delay: 0.5,
        // ease: "bounce.out"
    }, 0);

    tl.fromTo(".logo-mid", {
        autoAlpha: 0,
        opacity: 0,
    }, {
        autoAlpha: 1,
        opacity: 1,
        duration: 1,
        delay: 0.5,
    }, 0);
    tl.fromTo(".logo-title", {
        autoAlpha: 0,
        opacity: 0,

    }, {
        autoAlpha: 1,
        opacity: 1,
        duration: 3,
        delay: 3
    }, 0);

    tl.fromTo(".logo-text", {
        autoAlpha: 0,
        opacity: 0,

    }, {
        autoAlpha: 1,
        opacity: 1,
        duration: 3,
        delay: 3
    }, 0);

    if (innerWidth > 900) {
        tl.fromTo("#enterPondButton", {
            autoAlpha: 0,
            opacity: 0,
            y: 0,
            x: 0,
            top: "100vh",
        }, {
            autoAlpha: 1,
            opacity: 1,
            x: 0,
            y: "20vh",
            top: "66.5vh",
            duration: 5,
            delay: 4

        }, 0);
    } else {
        tl.fromTo("#enterPondButton", {
            autoAlpha: 0,
            opacity: 0,
            y: 0,
            x: 0,
        }, {
            autoAlpha: 1,
            opacity: 1,
            x: 0,
            y: "10vh",
            duration: 5,
            delay: 4

        }, 0);
    }

    if (innerWidth > 900) {
        tl.fromTo(".interior", {
            autoAlpha: 0,
            x: "-100%"
        }, {
            autoAlpha: 1,
            duration: 1,
            x: 0,
            delay: 4,
            ease: "power1.inOut",
            stagger: {

                amount: 1.5
            }
        }, 0);


        tl.set(".nav-button-container", {
            autoAlpha: 1, delay: 4
        }, 0);
    }

    let appearFrameNums = 27;
    let frameWidth = 266.5;
    $("#duck-idle").hide();
    tl.set(".logo-duck", {
        autoAlpha: 1, delay: 4
    }, 0);
    tl.to("#duck-appear", {
        backgroundPosition: (-frameWidth * appearFrameNums) + "px 0",
        ease: "steps(" + appearFrameNums + ")",
        duration: 2,
        delay: 4,
        onComplete: function () {
            $("#duck-appear").hide();
            $("#duck-idle").show();
        }


    }, 0);
    let idleFrameNums = 66;

    //gsap.set("#duck-idle", {backgroundImage: "url(assets/idle.png)", backgroundPosition: 0, delay: 6.8});
    gsap.to("#duck-idle", {
        backgroundPosition: (-frameWidth * idleFrameNums) + "px 0",
        ease: "steps(" + idleFrameNums + ")",
        duration: 5,
        repeat: -1,
        delay: 7
    });

    let grassFrames = 29;
    let grassLwidth = 598;
    // let grassLwidth = 597.86;
    // let grassRwidth = 307.66;
    let grassRwidth = 308.2;
    /*    gsap.to("#grass-L", {
            backgroundPosition: (-grassLwidth * grassFrames) + "px 0",
            ease: "steps(" + grassFrames + ")",
            duration: 2,
            repeat: -1
        }, 0);
        gsap.to("#grass-R", {
            backgroundPosition: (-grassRwidth * grassFrames) + "px 0",
            ease: "steps(" + grassFrames + ")",
            duration: 2,
            repeat: -1
        }, 0);*/


    let tl2 = gsap.timeline();
    // master.play()
    $("#enterPondButton").on("click", function () {
        if (isEnteringPond)
            return;
        isEnteringPond = true;
        console.log("enter pond clicked");
        if ($("#duck-appear").css("display") == "none" &&
            $("#duck-idle").css("display") == "block") {
            $("#duck-idle").hide();
            $("#duck-appear").show();
        }
        //play intro anim backwards
        tl.timeScale(2).reverse(0, true).then(function () {
            console.log("after click callback");
            // tl.timeScale(1);
            $("canvas").show();
            $("#home").hide();
            tl2.fromTo("#ponds-collapse", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);
            tl2.fromTo("#ponds-volume", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);
            tl2.fromTo("#ponds-logo-home", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);
            tl2.fromTo("canvas", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);
            tl2.fromTo("#pond-ui", {autoAlpha: 0}, {autoAlpha: 1, duration: 1}, 0).then(function () {
                //$("#pond-ui").show();
                window.game.input.enabled = true;
                window.game.scene.getScene("pond").updatePagination();
                isEnteringPond = false;
            });
            tl2.play();
        });
    });

    $("#ponds-logo-home").on("click", function () {
        if (isEnteringPond)
            return;
        isEnteringPond = true;
        window.game.input.enabled = false;

        tl2.timeScale(2).reverse(0, true).then(function () {
            $("canvas").hide();
            $("#home").show();
            tl.play().then(function () {
                isEnteringPond = false;
            });
        });
    });

    $("#ponds-collapse").on("click", function () {
        $("#pond-ui").fadeToggle();
    });

}

let newHeight, newWidth;
if (sceneHeight > sceneWidth) {
    newHeight = sceneHeight;
    newWidth = sceneHeight * (2003 / 1080);

} else {
    newHeight = sceneWidth * (1080 / 2003);
    newWidth = sceneWidth;
}

class MyGame extends Phaser.Scene {
    // jshint ignore:line
    constructor() {
        // console.log("mygame constructor called");
        super({
            key: "pond",
            active: true,

        });
    }

    preload() {
        // console.log("mygame preload");

        function loading() {
            // console.log("loading call");
            const progressWidth = 320;

            const progressBar = this.add.graphics();
            const progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(
                sceneWidth * 0.5 - progressWidth * 0.5 - 10,
                sceneHeight * 0.9,
                progressWidth,
                50
            );

            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            const loadingText = this.make.text({
                x: width / 2,
                y: sceneHeight * 0.9 - 55,
                text: "Loading...",
                style: {
                    font: "20px 'Nodo Sans JP'",
                    fill: "#FFF",
                },
            });
            loadingText.setOrigin(0.5, 0.5);

            const percentText = this.make.text({
                x: width / 2,
                y: sceneHeight * 0.9 - 30,
                text: "0%",
                style: {
                    font: "18px 'Nodo Sans JP'",
                    fill: "#FFF",
                },
            });
            percentText.setOrigin(0.5, 0.5);

            this.load.on("progress", function (value) {
                percentText.setText(parseInt(value * 100) + "%");
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(
                    sceneWidth * 0.5 - progressWidth * 0.5,
                    sceneHeight * 0.9 + 10,
                    (progressWidth - 20) * value,
                    30
                );
            });

            const that = this;

            // this.load.on("fileprogress", function (file, percentComplete) {
            //     //assetText.setText('Loading asset: ' + file.key);
            //     if (percentComplete === 1)
            //         console.log(file.key);
            // });

            $body.css("opacity", "1");

            this.load.on("complete", function () {
                //setTimeout(function () {
                that.scene.get("pond-manager");
                // pondManager.events.on(
                //     "reloadPond",
                //     function () {
                //         that.populateDucks(currentPond);
                //     },
                //     that
                // );

                // that.populateDucks(currentPond);
                // console.log('on preload complete settimeout')
                // that.generatePondUI();
                console.log("preload finish");
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
                $("#loadingDuck").hide();
                $("canvas").hide();
                startHomepageAnimation();
                window.game.input.enabled = false;
                //}, 1500);
            });
        }

        const t0 = performance.now();
        loading.call(this);
        const t1 = performance.now();
        console.log((t1 - t0) + " milliseconds.");


        //load intro files
        //preload the intro idle duck so it doesn't flicker
        this.load.image("introduckidle", "assets/idle.png");
        this.load.image("introduckappear", "assets/appear.png");
        this.load.image("intromid", "assets/mid.png");
        this.load.image("introfront", "assets/front.png");
        this.load.image("introsky", "assets/sky.png");

        this.load.image("introtitle", "assets/LogoAdjustedSize.png");


        //Load sprite atlas
        this.load.multiatlas("allDucks", ducksj, "assets");
        this.load.multiatlas("legs", legsj, "assets");
        this.load.multiatlas("splash", splashj, "assets");
        //Load audio files

        let sounds = soundsj.sounds;
        let soundsLen = sounds.length;
        for (let i = 0; i < soundsLen; i++) {
            this.load.audio("suba_" + (i + 1), "assets/" + sounds[i]);
        }
        // this.load.image("tiles", "assets/pond_vibrant_1920x1080.jpg");
        this.load.image("tiles", "assets/Subapond_vibrantHD-min.jpg");
        this.load.image("col", "assets/pond_color_invert.png");

        // this.load.image("tiles", "assets/pond_vibrant_1920x1080.jpg");
        this.load.tilemapTiledJSON("map", pondTileJson);
        this.listOfDucks = [];

        // this.load.image("grassVibrant", "assets/grass_vibrant_1920x1080.png");
        // this.load.image("waterVibrant", "assets/water_vibrant_1920x1080.png");
        // this.load.image("camerafilter", "assets/camerafilter.png");

        // this.add.image(0, 0, 'tiles')


    }

    create() {

        let pondManager = this.scene.get("pond-manager");
        pondManager.events.on(
            "reloadPond",
            function () {
                this.populateDucks(currentPond);
                this.applyTileCollisionCallbacks();
                last_collision_check = COLLISION_CHECK_RATE - 1;
            },
            this
        );


        this.makeSounds();
        this.makeVolumeButton();
        this.makeTileMap();
        this.addGhostTexture();
        this.panCameraForMobile();

        this.addPondClick();
        //apply collision callbacks and populate ducks moved into pancamera

        // this.populateDucks(currentPond);
        this.makeWalkingAnimationFrames();
        this.makeSplashAnimationFrames();
        this.generatePondUI();
        // this.applyCollisions();
        this.input.on("gameobjectup", this.onObjectClicked);


    }

    makeSounds() {
        let sounds = soundsj.sounds;
        this.numberOfSounds = sounds.length;
        for (let i = 1; i <= this.numberOfSounds; i++) {
            this.sound.add("suba_" + i);
        }
    }

    makeTileMap() {
        this.map = this.make.tilemap({key: "map"}); //, tileWidth: 64, tileHeight: 64 });
        window.map = this.map;
        let tileset = this.map.addTilesetImage("Subapond_vibrantHD-min", "tiles");
        window.tileset = tileset;
        // let tileset = this.map.addTilesetImage("pond_vibrant_1920x1080", "tiles");
        groundLayer = this.map.createLayer("ground", tileset);
        groundLayer.setCollisionByProperty({collides: true});
        pondLayer = this.map.createLayer("pond", tileset);
        pondLayer.setCollisionByProperty({collides: true});
        obstacleLayer = this.map.createLayer("obstacle", tileset);
        obstacleLayer.setCollisionByProperty({collides: true});
        transitionLayer = this.map.createLayer("transition", tileset);
        transitionLayer.setCollisionByProperty({collides: true});

        let layers = [groundLayer, pondLayer, obstacleLayer, transitionLayer];


        console.log(`pond size (${innerWidth}, ${innerHeight})->(${newWidth}, ${newHeight})`);
        layers.forEach(function (l) {
            l.setDisplaySize(newWidth, newHeight);
            l.alpha = 0;
        });

    }

    addGhostTexture() {
        let pondImg = this.add.image(newWidth / 2, newHeight / 2, "tiles");
        pondImg.setOrigin(0.5);
        pondImg.setDisplaySize(newWidth, newHeight);
        // pondImg.setDisplayOrigin();
        console.log("img", this.textures.list.col.source[0].source);
        $("#ghost").append(this.textures.list.col.source[0].source);
        $("#ghost img").attr("id", "ghostIMG");

        const canvasGhost = document.createElement("canvas");
        canvasGhost.width = newWidth;
        canvasGhost.height = newHeight;

        const ghost2d = canvasGhost.getContext("2d");
        ghost2d.drawImage(document.getElementById("ghostIMG"), 0, 0, newWidth, newHeight);

        this.textures.addBase64("ghostCollision", canvasGhost.toDataURL());

    }

    panCameraForMobile() {
        let cam = this.cameras.main;
        let wv = cam.worldView;
        let that = this;
        if (innerWidth < 900) {
            console.log("camera panning");
            this.cameras.main.pan(newWidth * 0.43, newHeight / 2, 0, "none", true);
            //timer needed because viewport doesn't update until next render
            this.time.addEvent({
                delay: 500, callback: function () {
                    // that.physics.world.setBoundsCollision(false, false, false, false);
                    that.boundsLeft = wv.left;
                    that.boundsRight = wv.right;
                    that.boundsTop = wv.top;
                    that.boundsBot = wv.bottom;

                    that.boundsMidPtX = (that.boundsLeft + that.boundsRight) / 2;
                    that.boundsMidPtY = (that.boundsTop + that.boundsBot) / 2;
                    that.halfWidth = that.boundsMidPtX - that.boundsLeft;
                    that.populateDucks(currentPond);
                    that.applyTileCollisionCallbacks();

                }
            });
        } else {

            this.boundsLeft = wv.left;
            this.boundsRight = wv.right;
            this.boundsTop = wv.top;
            this.boundsBot = wv.bottom;
            this.boundsMidPtX = (this.boundsLeft + this.boundsRight) / 2;
            this.boundsMidPtY = (this.boundsTop + this.boundsBot) / 2;
            this.halfWidth = this.boundsMidPtX - this.boundsLeft;
            this.populateDucks(currentPond);
            this.applyTileCollisionCallbacks();

        }


    }

    makeVolumeButton() {
        //volume toggler
        let scene = this;
        $("#ponds-volume").on("click", function () {
            isMuted = !isMuted;
            if (isMuted) {
                document.getElementById("ponds-volume").style.backgroundImage = "url(../assets/volume_mute.png)";
            } else {
                document.getElementById("ponds-volume").style.backgroundImage = "url(../assets/volume.png)";
            }
            scene.sound.setMute(isMuted);
        });
    }

    // /// Unused
    // applyCollisions() {
    //     let gameObjectList = this.children.list;
    //     let this = this;
    //     gameObjectList.forEach(function (gameObject) {
    //         if (gameObject.type === "Container") {
    //             let duckGO = gameObject.last;
    //             // console.log("watery", waterVibrant);
    //             that.physics.add.overlap(duckGO, waterVibrant, function (context) {
    //                 // console.log(context.displayName + " swimming");
    //                 // context.isSwimming = true;
    //                 // context.waterOverlay.setVisible(true)
    //                 context.legsOverlay.setVisible(false);
    //             }, null, this);
    //             that.physics.add.overlap(duckGO, grassVibrant, function (context) {
    //                 // console.log(context.displayName + " grounded");
    //                 // context.isSwimming = false;
    //                 // context.waterOverlay.setVisible(true)
    //                 context.legsOverlay.setVisible(true);
    //
    //             }, null, this);
    //         }
    //     });
    // }

    applyTileCollisionCallbacks() {

        let gameObjectList = this.listOfDucks;
        let that = this;
        // if (window.game.textures.getPixel(context.legsOverlay.body.x, context.legsOverlay.body.y, "col").r == 0) {
        //     context.legsOverlay.setVisible(false);
        //     context.splashOverlay.setVisible(true);
        // } else {
        //     context.legsOverlay.setVisible(true);
        //     context.splashOverlay.setVisible(false);
        // }
        gameObjectList.forEach(function (gameObject) {
            //pond
            pondLayer.setTileIndexCallback(
                pondTileIndices,
                function (context, con2) {
                    if (last_collision_check < COLLISION_CHECK_RATE) return;
                    // console.log("swimming");
                    if (window.logSwim) {
                        // console.log("swi context", context, con2);
                        window.logSwim = false;
                    }
                    context.setVisible(true);
                    context.duck.legsOverlay.setVisible(false);
                },
                null,
                this
            );
            that.physics.add.overlap(gameObject.splashOverlay, pondLayer);
            //ground
            groundLayer.setTileIndexCallback(
                groundTileIndices,
                function (context) {
                    if (last_collision_check < COLLISION_CHECK_RATE) return;

                    // console.log("grounded")
                    context.duck.splashOverlay.setVisible(false);
                    context.setVisible(true);
                },
                null,
                this
            );
            that.physics.add.overlap(gameObject.legsOverlay, groundLayer);
            //transition
            that.physics.add.overlap(gameObject.legsOverlay, transitionLayer);


            //Check collision on tiles that need more precise checking by comparing a pixel on legs against a 'collision map'
            transitionLayer.setTileIndexCallback(
                transitionTileIndices,
                function (legs) {
                    if (last_collision_check < COLLISION_CHECK_RATE) return;
                    let colorAtPosn = that.textures.getPixel(legs.body.x, legs.body.y, "ghostCollision");
                    try {
                        let isInWater = colorAtPosn.red < 100;
                        legs.setVisible(!isInWater);
                        legs.duck.splashOverlay.setVisible(isInWater);
                    } catch (e) {
                        let debugstr = `container:(x:${legs.parentContainer.body.x}, y:${legs.parentContainer.body.y},
                        legs:(x:${legs.body.x}, y:${legs.y})`;
                        /*
                                                errors at container:(x:18, y:533,legs:(x:-32, y:20)*/
                        // console.log(`${context.displayName} : x${context.legsOverlay.body.x}, y${context.legsOverlay.body.y}, ${colorAtPosn.red}`);
                        console.error(e);
                        console.log(debugstr);
                    }
                },
                null,
                this
            );


            //obstacle
            that.physics.add.collider(gameObject.parentContainer, obstacleLayer, function (container) {
                container.body.stop();
                gameObject.animState = DUCK_STATES.START_IDLE;

            }, null, this);
        });


        if (DEBUGGING) {
            const debugGraphics = this.add.graphics().setAlpha(0.75);
            obstacleLayer.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
            transitionLayer.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(255, 134, 255, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(255, 39, 37, 255) // Color of colliding face edges
            });
        }
    }

    makeWalkingAnimationFrames() {
        const walkingNames = [
            ["idle", 1, 1],
            ["walk", 0, 2],
            ["quack", 1, 1],
        ];

        walkingNames.forEach((animationName) => {
            let animName = animationName[0];
            let startFrame = animationName[1];
            let endFrame = animationName[2];
            let frameNames = this.anims.generateFrameNames("legs", {
                start: startFrame,
                end: endFrame,

                suffix: ".png",
            });

            this.anims.create({
                key: animName,
                frames: frameNames,
                frameRate: FRAME_RATE,
                repeat: -1,
            });
        });

        let walkAnim = this.anims.get("walk");
        walkAnim.addFrameAt(0, this.anims.get("idle").getFrames());
    }

    makeSplashAnimationFrames() {
        const splashNames = [
            ["splash-idle", 0, 13],
            ["splash-walk", 0, 13],
            ["splash-quack", 0, 13],
        ];

        splashNames.forEach((animationName) => {
            let animName = animationName[0];
            let startFrame = animationName[1];
            let endFrame = animationName[2];
            let frameNames = this.anims.generateFrameNames("splash", {
                start: startFrame,
                end: endFrame,
                suffix: ".png",
            });

            this.anims.create({
                key: animName,
                frames: frameNames,
                frameRate: FRAME_RATE,
                repeat: -1,
            });
        });

    }

    //Fill pond number with their ducks
    populateDucks(pond = 1) {
        console.log(`Populating ducks in pond #${pond}...`);
        //Get submission reference sheet from google sheet and filter by pond #
        const submissionsArray = submissions["submissions"];

        const ducks = submissionsArray.filter(function (obj) {
            return parseInt(obj.pond) === pond;
        });

        //Create sprite for ducks and add their animations
        for (let i = 0; i < ducks.length; i++) {

            const duckGameObject = this.physics.add
                .sprite(0, 0, "allDucks", ducks[i].image + "-0.png");
            // .setCollideWorldBounds(true)
            // .setBounce(1, 1)
            // .setDebugBodyColor(0x00FF)
            // .setDebug(true, false, 0x00ff); //, new Phaser.Display.Color(255, 0, 0, 0));
            // console.log(duckGameObject);
            this.physics.add.collider(duckGameObject, obstacleLayer);
            const legsOverlay = this.physics.add.sprite(0, 0, "legs", "1.png");
            legsOverlay.setVisible(true);
            legsOverlay.name = "legs";
            legsOverlay.setOrigin(0.5, 0.5);
            legsOverlay.y = 20;

            const splashOverlay = this.physics.add.sprite(0, 0, "splash", "0.png");
            splashOverlay.setVisible(false);
            splashOverlay.name = "splash";
            splashOverlay.setOrigin(0.5, 0.5);
            splashOverlay.setScale(0.6);
            splashOverlay.y = 40;

            let duckContainer = this.add.container(
                getRandomIntInclusive(this.boundsLeft, this.boundsRight),
                getRandomIntInclusive(newHeight * 0.3, newHeight * 0.7),
            );

            duckContainer = this.physics.add.existing(duckContainer);
            // duckContainer.body.collideWorldBounds = true;

            if (innerWidth > 900) {
                duckContainer.body.collideWorldBounds = true;
            }

            duckContainer.add(legsOverlay);
            duckContainer.add(splashOverlay);
            duckContainer.add(duckGameObject);
            duckContainer.duck = duckGameObject;
            //Init duck GO properties
            duckGameObject.name = "duck";
            duckGameObject.parentContainer = duckContainer;
            duckGameObject.legsOverlay = legsOverlay;
            duckGameObject.legsOverlay.duck = duckGameObject;
            duckGameObject.splashOverlay = splashOverlay;
            duckGameObject.splashOverlay.duck = duckGameObject;

            duckGameObject.displayName = ducks[i].name;
            duckGameObject.message = ducks[i].message;

            //Assign sound if it was blank, and assign random one for random pickers
            duckGameObject.sound = ducks[i].sound ? ducks[i].sound : -1;
            duckGameObject.sound = ducks[i].sound == -1 ? getRandomIntInclusive(1, this.numberOfSounds) : ducks[i].sound;

            duckGameObject.setOrigin(0.5, 0.5);
            duckGameObject.displayWidth = SPRITE_WIDTH;
            duckGameObject.displayHeight = SPRITE_HEIGHT;


            // duckGameObject.body.overlapX = Math.floor(duckGameObject.body.x * 0.5);
            // duckGameObject.body.overlapY = Math.floor(duckGameObject.body.y * 0.9);
            // duckGameObject.body.syncBounds=true;


            //Starting swimming state (unused)
            duckGameObject.isSwimming = false;

            duckGameObject.animState = DUCK_STATES.START_IDLE;

            //Duck object = {strName,strImageName,numPondNumber}, matches submission json

            const currentDuck = ducks[i].image;

            //Create animations
            // const animationNames = [['idle', 0, 0], ['walk', 1, 2], ['quack', 3, 3], ['swim-idle', 4, 4], ['swim', 5, 6], ['swim-quack', 7, 7]];
            const animationNames = [
                ["idle", 0, 0],
                ["walk", 1, 2],
                ["quack", 3, 3],
            ]; //, ['swim-idle', 0, 0], ['swim', 1, 2], ['swim-quack', 3, 3]];


            //Generate frame names
            animationNames.forEach((animationName) => {
                let animName = animationName[0];
                let startFrame = animationName[1];
                let endFrame = animationName[2];
                let frameNames = this.anims.generateFrameNames("allDucks", {
                    start: startFrame,
                    end: endFrame,
                    prefix: currentDuck + "-",
                    suffix: ".png",
                });

                this.anims.create({
                    key: currentDuck + "-" + animName,
                    frames: frameNames,
                    frameRate: FRAME_RATE,
                    repeat: -1,
                });
            });

            // //insert 1 more frame of idle inbetween the walk frames
            let walkAnim = this.anims.get(currentDuck + "-" + "walk");
            walkAnim.addFrameAt(1, this.anims.get(currentDuck + "-" + "idle").getFrames());

            let clickContainer = this.add.rectangle(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT, 0x6666ff, 0);
            clickContainer.duck = duckGameObject;
            duckContainer.add(clickContainer);
            //Set event for click/press
            clickContainer.setInteractive();
            clickContainer.input.cursor = "pointer";
            clickContainer.input.hitArea.y += 25;
            //duckGameObject.input.cursor = "pointer";
            //duckGameObject.input.hitArea.setTo(0,25,100,100);


            if (DEBUGGING) {
                this.input.enableDebug(clickContainer, 0x04F404);
            }
            // console.log("duck", duckGameObject);

            //Fix hitbox
            this.time.addEvent({
                delay: 1000,
                callback: function () {
                    //in case we were destroyed before executing
                    if (duckGameObject.parentContainer == null)
                        return;

                    duckGameObject.parentContainer.body.setSize(duckGameObject.width, duckGameObject.height / 2, false);
                    duckGameObject.parentContainer.body.setOffset(-duckGameObject.width / 2, -duckGameObject.height / 4);

                    duckGameObject.legsOverlay.body.setSize(80, 10, false);
                    duckGameObject.legsOverlay.body.setOffset(10, 70);
                    duckGameObject.splashOverlay.body.setSize(135, 10, false);
                    duckGameObject.splashOverlay.body.setOffset(15, 50);
                },
                callbackScope: this,
                loop: false,
            });

            let that = this;

            //Set OnUpdate to use animations
            duckGameObject.updateState = function (context, delta) {
                switch (context.animState) {
                case DUCK_STATES.START_IDLE:
                    context.play(currentDuck + "-idle");
                    // if (!context.isSwimming)
                    context.legsOverlay.play("idle");
                    context.splashOverlay.play("splash-idle");
                    context.idleTime = getRandomIntInclusive(MIN_IDLE_TIME, MAX_IDLE_TIME);
                    context.animState = DUCK_STATES.IDLE;
                    break;
                case DUCK_STATES.IDLE:
                    context.idleTime -= delta;
                    if (context.idleTime <= 0) {

                        context.animState = DUCK_STATES.START_WALKING;
                    }
                    break;
                case DUCK_STATES.START_WALKING: {
                    let body = context.parentContainer;
                    const destinationX = that.getRandomDestinationX(
                        body.x,
                        MAX_TRAVEL_DIST_X
                    );
                    const destinationY = that.getRandomDestinationY(
                        body.y,
                        MAX_TRAVEL_DIST_Y
                    );

                    context.flipX = destinationX <= body.x;
                    context.legsOverlay.flipX = destinationX <= body.x;
                    context.travelTime = getRandomIntInclusive(MIN_TRAVEL, MAX_TRAVEL_TIME);

                    // let target = new Phaser.Math.Vector2(destinationX, destinationY);
                    that.physics.moveTo(body, destinationX, destinationY, WALK_SPEED, context.travelTime);
                    // body.setVelocity(destinationX, destinationY);
                    // body.velocity.normalize().scale(WALK_SPEED);
                    // context.tween = scene.tweens.add({
                    //     targets: context.parent,
                    //     x: destinationX,
                    //     y: destinationY,
                    //     duration: context.travelTime,
                    //     ease: "Linear",
                    // });

                    context.play(currentDuck + "-walk");
                    context.legsOverlay.play("walk");
                    context.splashOverlay.play("splash-walk");
                    context.animState = DUCK_STATES.WALKING;
                    break;
                }
                case DUCK_STATES.WALKING:
                    context.travelTime -= delta;
                    if (context.travelTime <= 0) {
                        context.parentContainer.body.stop();
                        context.animState = DUCK_STATES.START_IDLE;
                    }
                    break;
                case DUCK_STATES.START_QUACK:
                    context.parentContainer.body.stop();
                    context.play(currentDuck + "-quack");
                    // if (!context.isSwimming)
                    context.legsOverlay.play("quack");
                    context.splashOverlay.play("splash-quack");

                    context.quackTime = QUACK_DURATION;
                    context.animState = DUCK_STATES.QUACK;
                    break;
                case DUCK_STATES.QUACK:
                    context.quackTime -= delta;
                    if (context.quackTime <= 0) {
                        context.animState = DUCK_STATES.START_IDLE;
                    }
                    break;


                default:
                    break;
                }
            };
            //end OnUpdate
            this.listOfDucks.push(duckGameObject);
        }


    }

    onObjectClicked(pointer, gameObject) {
        // if (gameObject.name == "bg") {
        this.scene.events.emit("clearmessages");
        // return;
        // }
        const duck = gameObject.duck;
        if (duck == null)
            return;
        // if the text is already being displayed, do nothing
        if ((duck.namePopup == null || duck.msgPopup == null)) {
            duck.animState = DUCK_STATES.START_QUACK;
            this.scene.sound.play("suba_" + duck.sound);
            this.scene.events.emit("duckclick", duck);
        }
    }

    generatePondUI() {
        // console.log("generate pond ui");
        $body.append("<div style='display:none;' class='ui-img' id='pond-ui'><div class='inner-ui'></div></div>");
        let pond = $("#pond-ui .inner-ui");
        // pond.append("<img src='assets/subaru_uitest_1.png'></img>")
        pond.append("<h3 text='main-15'>Select pond</h3>");
        pond.append("<div class='button-list'></div>");
        for (let a = 0; a < maxPond; a++) {
            $(".button-list").append(
                "<button class='load-pond'  pond='" +
                (a + 1) +
                "'>" +
                (a + 1) +
                "</button>"
            );
        }
        maxPages = Math.ceil(maxPond / pondsPerPage);
        pond.append("<button class='button-list' id='prevPage' text='main-16'>Prev</button>");
        pond.append("<button class='button-list' id='nextPage' text='main-17'>Next</button>");


        $(".load-pond[pond=1]").addClass("selectedPond");
        let that = this;
        $("#prevPage").on("click", function () {
            if (currentPondPagination != 0) {
                currentPondPagination--;
            } else {
                currentPondPagination = maxPages - 1;
            }
            that.updatePagination();
        });
        $("#nextPage").on("click", function () {
            if (currentPondPagination < maxPages - 1) {
                currentPondPagination++;
            } else {
                currentPondPagination = 0;
            }
            that.updatePagination();
        });
        this.updatePagination();

    }

    updatePagination() {
        $(".load-pond").removeClass("visible");
        for (let i = 0; i < pondsPerPage; i++) {
            let pondnum = currentPondPagination * pondsPerPage + i;
            $(`.load-pond[pond=${pondnum}]`).addClass(
                "visible"
            );
        }
    }

    update(time, delta) {
        last_collision_check = last_collision_check > COLLISION_CHECK_RATE ? 0 : last_collision_check + 1;
        //todo: find a way to call update on every duck without looping thru every single object every frame holy crap
        let len = this.listOfDucks.length;
        for (let i = 0; i < len; i++) {
            try {
                let duckGO = this.listOfDucks[i];
                duckGO.updateState(duckGO, delta);
                // console.log(duckGO.displayName + duckGO.parentContainer.y);
                duckGO.parentContainer.setDepth(duckGO.parentContainer.y);
            } catch (e) {
                console.error(e);
            }
        }
    }


    getRandomDestinationX(startPos, maxDist) {
        let dist = getRandomIntInclusive(0, 1) === 1 ? -1 * maxDist : maxDist;
        let destination = getRandomIntInclusive(startPos, startPos + dist);
        // console.log(startPos,destination)
        if (destination < this.boundsLeft || destination > this.boundsRight)
            destination = startPos - (destination / 2);
        return destination;
    }

    getRandomDestinationY(startPos, maxDist) {
        let dist = getRandomIntInclusive(0, 1) === 1 ? -1 * maxDist : maxDist;
        let destination = getRandomIntInclusive(startPos, startPos + dist);
        if (destination < this.boundsTop || destination > this.boundsBot)
            destination = startPos - (destination / 2);
        return destination;
    }

    addPondClick() {
        let clickContainer = this.add.rectangle(newWidth / 2, newHeight / 2, newWidth, newHeight, 0x6666ff, 0);
        clickContainer.name = "bg";
        clickContainer.setZ(-1);
        //Set event for click/press
        clickContainer.setInteractive();


        if (DEBUGGING) {
            this.input.enableDebug(clickContainer, new Phaser.Display.Color(102, 102, 55, 125));
        }
    }
}

class PondManager
    extends Phaser
        .Scene {
    constructor() {
        // console.log("pond manager constructor");
        super({key: "pond-manager", active: true});
        this.pondNum = 1;
        this.activeMessagesEvents = [];
        this.activeMessagesDuck = [];
        this.activeMessagesPanel = [];
    }

    preload() {
        this.load.image("panel", "assets/subaru_uitest_1.png");

        // if (innerWidth < 900) {
        //     this.cameras.main.pan(newWidth * 0.43, newHeight / 2, 0, "none", true);
        //
        // }
    }

    create() {
        /*        this.infoText = this.add.text(10, 10, `Pond ${this.pondNum}`, {font: '48px Arial', fill: '#000000'});
                    this.infoText.setInteractive();
                    this.input.on('gameobjectup', this.clickHandler, this);
                    this.infoText.input.cursor="pointer";*/
        // console.log(this.scene);
        let that = this;
        $body.on("click", ".load-pond", function () {
            $(".load-pond").removeClass("selectedPond");
            $(this).addClass("selectedPond");
            // console.log($(this).attr("pond"));
            that.loadPond(parseInt($(this).attr("pond")));
        });
        let pond = this.scene.get("pond");

        // this.scene.add.text();
        // uiscene.add.text();
        pond.events.on("clearmessages", function () {
            console.log("bg clickd");
            console.log(this);
            if (that.activeMessagesEvents.length == 0 ||
                that.activeMessagesPanel.length == 0 ||
                that.activeMessagesDuck.length == 0)
                return;
            that.activeMessagesEvents.forEach(function (event) {
                event.remove(false);

            });
            that.activeMessagesEvents = [];
            that.activeMessagesPanel.forEach(function (panel) {
                that.tweens.add({
                    targets: panel,
                    alpha: 0,
                    duration: 1000,
                    ease: "linear"
                }, that);
                that.time.addEvent({
                    delay: 1000,
                    callback: function () {
                        panel.destroy();
                    }
                });
            });
            that.activeMessagesPanel = [];
            that.activeMessagesDuck.forEach(function (duck) {
                pond.time.addEvent({
                    delay: 1000,
                    callback: function () {
                        this.namePopup = null;
                        this.msgPopup = null;
                    },
                    callbackScope: duck,
                });
            });
            that.activeMessagesDuck = [];


        });

        pond.events.on("duckclick", function (gameObject) {

            let x = gameObject.parentContainer.x - (SPRITE_WIDTH / 2);
            let y = gameObject.parentContainer.y - (SPRITE_HEIGHT / 2);
            let panel;


            if (sceneWidth < 900) {
                panel = pond.add.container();
            } else {
                panel = pond.add.container(x - 50, y - 120);
            }
            //let img = pond.add.image(0, 0, "panel");


            let name = pond.add.text(0, 0, gameObject.displayName, MSG_TEXT_CONFIG);
            gameObject.namePopup = name;

            let msg = pond.add.text(0, 20, gameObject.message, MSG_TEXT_CONFIG);
            //console.log("mensaje",msg,img);
            gameObject.msgPopup = msg;

            let img = pond.add.nineslice(
                -10, -10,   // this is the starting x/y location
                Math.max(name.displayWidth, msg.displayWidth) + 20, msg.displayHeight + name.displayHeight + 20,   // the width and height of your object
                "panel", // a key to an already loaded image
                30,         // the width and height to offset for a corner slice
                10          // (optional) pixels to offset when computing the safe usage area
            );

            panel.add(img);
            panel.add(name);
            panel.add(msg);
            img.setOrigin(0, 0);
            panel.sendToBack(img);
            panel.setDepth(9999);
            panel.setAlpha(0);
            if (sceneWidth < 900) {
                if (x > pond.boundsMidPtX) {
                    if (img.displayWidth > pond.halfWidth)
                        panel.setPosition(Math.max(pond.boundsLeft, pond.boundsRight - img.displayWidth), y - SPRITE_HEIGHT);
                    else
                        panel.setPosition(x, y - SPRITE_HEIGHT);
                } else {
                    // console.log(sceneWidth * .48 + 100, x - 50);
                    panel.setPosition(pond.boundsLeft, y - SPRITE_HEIGHT);//pond.boundsBot / 2);
                }
            }

            this.tweens.add({
                targets: panel,
                alpha: 1,
                duration: 1000,
                ease: "linear"
            }, this);

            // console.log(name);
            // console.log(img);
            let fadeout = pond.time.addEvent({
                delay: USERNAME_DISPLAY_DURATION - 1000,
                callback: function () {
                    this.tweens.add({
                        targets: panel,
                        alpha: 0,
                        duration: 1000,
                        ease: "linear"
                    }, this);
                    that.activeMessagesEvents = arrayRemove(that.activeMessagesEvents, fadeout);
                },
                callbackScope: pond,
            });

            let destroy = pond.time.addEvent({
                delay: USERNAME_DISPLAY_DURATION,
                callback: function () {
                    panel.destroy();
                    // this.namePopup.destroy();
                    this.namePopup = null;
                    // this.msgPopup.destroy();
                    this.msgPopup = null;
                    // img.destroy();
                    that.activeMessagesDuck = arrayRemove(that.activeMessagesDuck, this);
                    that.activeMessagesPanel = arrayRemove(that.activeMessagesPanel, panel);
                    that.activeMessagesEvents = arrayRemove(that.activeMessagesEvents, destroy);
                },
                callbackScope: gameObject,
            });

            this.activeMessagesEvents.push(fadeout);
            this.activeMessagesEvents.push(destroy);
            this.activeMessagesDuck.push(gameObject);
            this.activeMessagesPanel.push(panel);

        }, this);
        this.scene.bringToTop();
    }

    // clickHandler(pointer, obj) {
    //     console.log("Click");
    //     const pond = this.scene.get("pond");
    //     pond.children.shutdown();
    //     // emit event to reload the ducks
    //
    //     this.pondNum = (this.pondNum % maxPond) + 1;
    //     currentPond = this.pondNum;
    //     this.events.emit("reloadPond");
    //
    //     //this.infoText.setText(`Pond ${this.pondNum}`);
    // }

    loadPond(id) {
        if (this.pondNum == id) {
            return;
        }
        // console.log("load pond " + id);
        const pond = this.scene.get("pond");
        //todo: if performance becomes issue look into pooling
        pond.listOfDucks.forEach(function (duck) {
            duck.parentContainer.destroy();
        });
        pond.listOfDucks = [];
        // emit event to reload the ducks

        this.pondNum = id;
        currentPond = this.pondNum;
        this.events.emit("reloadPond");
        //this.infoText.setText(`Pond ${this.pondNum}`);
    }
}


const config = {
    type: Phaser.CANVAS,
    width: innerWidth,
    height: innerHeight,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            // fps: 30,
            debug: DEBUGGING,
            gravity: {y: 0},
            tileBias: 120,
        },
    },
    plugins: {
        global: [NineSlicePlugin.DefaultCfg],
    },
    scene: [PondManager, MyGame],
};

const game = new Phaser.Game(config);
window.game = game;
$("#home").hide();

function changeScreen(screen) {
    hideScreen();
    $("#screens").show();
    window.game.input.enabled = false;
    $("canvas").hide();
    $("#ponds-collapse").fadeOut();
    $(screen).show();
}

function hideScreen() {
    console.log("hidescreen");
    $("#pond-ui").hide();
    $(".screen").hide();
}


$("#home-tab").on("click", function () {
    changeScreen("#home");
});
$("#about-project-tab").on("click", function () {
    changeScreen("#about-project");
});
$("#about-subaru-tab").on("click", function () {
    changeScreen("#about-subaru");
});

$body.on("click", ".navbar a", function () {
    let $navbar = $(".navbar-toggler");
    if (!$navbar.hasClass("collapsed")) {
        $navbar.trigger("click");
    }
});

//helpers
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}
