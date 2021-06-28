let DEBUGGING = false;
let TEST_DATA = true;

let sceneWidth = innerWidth;
let sceneHeight = innerHeight;

const MOBILE_MAX_WIDTH = 900;
const IS_MOBILE = sceneWidth < MOBILE_MAX_WIDTH;
console.log("is mobile? " + IS_MOBILE);
require("./assets/css/modal.css");
require("./assets/css/dropdown-img.css");
require("./assets/css/style.css");
require("./assets/css/credits.css");
let loadingduck = require("./assets/images/ui/loadingduck.svg");
require("./assets/images/subahug3.png");
require("./assets/images/404.png");

require("./assets/images/ui/Little_Megaphone_volume.png");
require("./assets/images/ui/Little_Megaphone_no_volume_v2.png");
require("./assets/images/ui/artduck.png");
require("./assets/images/ui/Stars_resized.png");
require("./assets/images/ui/Star_bg_reszied.png");
require("./assets/images/ui/megaphone_resized.png");
require("./assets/images/ui/NameHeader_resized.png");
require("./assets/images/ui/Window_resized.png");
require("./assets/images/ui/fanart-logo.png");
require("./assets/images/LanguageButton.png");
require("./assets/images/star-alone.png");
require("./assets/images/megaphone-alone.png");


function importAll(r) {
    return r.keys().map(r);
}

let templatej = require("./assets/submissions/TEMPLATE.json");
require("./assets/submissions/TEMPLATE.png");


// let allducksjson = require.context("./assets/submissions",true,/pondbatch.*\.json"$/);


const cache = {};

function requireAll(r) {
    r.keys().forEach((key) => (cache[key] = r(key)));
}


requireAll(require.context("./assets/submissions", true, /pondbatch.*\.(json)"$/));


let submissions = require("./assets/submissions/submissions.json");
importAll(require.context("./assets/submissions", true, /pondbatch.*\.(png|jpe?g|svg)$/));

//test data
// ducksj = require("./assets/test_submissions/all_ducks_sheet.json");
// submissions = require("./assets/test_submissions/submissions.json");
// importAll(require.context("./assets/test_submissions", true, /all_ducks_sheet.*\.(png|jpe?g|svg)$/));


const legsj = require("./assets/Duck Templates Resized/Duck Leg Cut/legs/legs.json");
const splashj = require("./assets/pond/WaterSplashAnimation/splash.json");
const pondTileJson = require("./assets/pond/pond.json");
const pond_1024 = require("./assets/pond/pond_1024.json");
const soundsj = require("./assets/sound/soundfilemap.json");
let numberOfSounds = 0;
window.logSwim = true;

require("phaser");
// const NineSlicePlugin = require("phaser3-nineslice");
import {Plugin as NineSlicePlugin} from "phaser3-nineslice";

// require("./assets/Subapond vibrant/water_vibrant_1920x1080.png");
// require("./assets/Subapond vibrant/grass_vibrant_1920x1080.png");
// require("./assets/pond/pond_vibrant_1920x1080.jpg");
require("./assets/pond/pond_color_invert.png");

require("./assets/pond/WaterSplashAnimation/splash.png");
require("./assets/images/ui/subaru_uitest_1.png");
if (IS_MOBILE)
    require("./assets/pond/Subapond_vibrant_1024x1024.jpg");
else
    require("./assets/pond/Subapond_vibrantHD-min.jpg");


// importAll(require.context("./assets/Duck Templates Resized/Duck Leg Cut/legs/", true, /legs.*\.(png|jpe?g|svg)$/));
require("./assets/Duck Templates Resized/Duck Leg Cut/legs/legs.png");
importAll(require.context("./", true, /pond.*\.(json)$/));
importAll(require.context("./assets/sound/", true, /.*\.(mp3|ogg|wav)$/));

let fanartSubmissions = require("./assets/fanart/fanartSubmissions.json");
let boatj = require("./assets/fanart/boat/boat.json");
let explodej = require("./assets/fanart/boat/explode.json");
importAll(require.context("./assets/fanart/boat", true, /.*\.(png|jpe?g|svg)$/));
importAll(require.context("./assets/fanart", true, /FANART.*\.(png|jpe?g|svg)$/));

//ORTHOGNAL
let groundTileIndices, pondTileIndices, obstacleTileIndices, transitionTileIndices;

if (IS_MOBILE) {
    pondTileIndices = [20, 21, 22, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56];
    groundTileIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 19, 23, 24, 57, 58, 59, 60, 61, 62, 63, 64];
    obstacleTileIndices = [12, 13, 14];
} else {
    groundTileIndices = [1, 2, 3, 4, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 44, 45, 46, 47, 48, 51, 63, 64, 80, 81, 82, 83, 96, 97, 98, 99, 111, 112, 114, 115, 116, 121, 122, 123, 124, 125, 126, 127, 128, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142];
    pondTileIndices = [40, 41, 42, 53, 56, 57, 58, 59, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 101, 102, 103, 104, 105, 106, 107, 108];
    obstacleTileIndices = [5, 6, 7, 8, 11, 16, 24, 25, 26, 32, 60, 61, 62, 67, 109, 110, 113, 129, 130, 143, 144];
    transitionTileIndices = [39, 43, 49, 50, 52, 54, 55, 65, 66, 79, 95, 100, 117, 118, 119, 120];
}

let pondLayer, groundLayer, obstacleLayer, transitionLayer;


//number of frames to wait before each collision check
const COLLISION_CHECK_RATE = 10;
let last_collision_check = 0;

const FRAME_RATE = 10;
const USERNAME_DISPLAY_DURATION = 10000;
const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const QUACK_DURATION = 9000;


const MIN_TRAVEL = 1000;
const MAX_TRAVEL_TIME = 5000;
const MAX_TRAVEL_DIST_X = sceneHeight / 8;
const MAX_TRAVEL_DIST_Y = sceneWidth / 8;
const WALK_SPEED = 100;
const MIN_IDLE_TIME = 0;
const MAX_IDLE_TIME = 5000;


//the width of the panel
const TEXT_PADDING_CONFIG = {x: 20, y: 10};
const WORD_WRAP_CONFIG = {width: 200, useAdvancedWrap: true};
const MSG_TEXT_CONFIG = {
    fontFamily: "meyro",
    fontSize: "14px",
    color: "#000",
    stroke: "#000",
    strokeThickness: 1,
    padding: TEXT_PADDING_CONFIG,
    wordWrap: WORD_WRAP_CONFIG
};


let currentPondPagination = 0;

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
const animationNames = [
    ["idle", 0, 0],
    ["walk", 1, 2],
    ["quack", 3, 3],
];


let $body = $("body");

function startHomepageAnimation() {
    $("#home").show();
    gsap.set(".modal-window", {visibility: "inherit", delay: 5});
    let tl = gsap.timeline();

    if (!IS_MOBILE) {
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
        bottom: "-200%"
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

    if (!IS_MOBILE) {
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
            y: "0vh",
            top: "0",
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

    if (!IS_MOBILE) {
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

    /*
    let grassFrames = 29;
    let grassLwidth = 598;
    // let grassLwidth = 597.86;
    // let grassRwidth = 307.66;
    let grassRwidth = 308.2;
    */
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
            // tl2.fromTo("#ponds-volume", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);
            tl2.fromTo("#ponds-to-fanart", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);
            tl2.fromTo("#ponds-logo-home", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);
            tl2.fromTo("canvas", {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 0);


            tl2.fromTo("#pond-ui", {autoAlpha: 0}, {autoAlpha: 1, duration: 1}, 0).then(function () {
                $("#pond-ui").show();
                window.game.input.enabled = true;
                // window.game.scene.getScene("pond").updatePagination();
                isEnteringPond = false;
                $(".scene-switch-btn").attr("locked", "false");

            });
            tl2.play();

            if (!game.scene.keys.hasOwnProperty("pond-manager")) {
                game.scene.add("pond-manager", new PondManager());
                game.scene.add("pond", new SubatomoPond());
                game.scene.add("fanart", new FanartPond());

            }
        });
    });

    $("#ponds-logo-home").on("click", function () {
        if (isEnteringPond || $(this).attr("locked") == "true")
            return;
        isEnteringPond = true;
        window.game.input.enabled = false;
        $(".scene-switch-btn").attr("locked", "true");
        gsap.to("#pond-ui", {autoAlpha: 0, duration: 1});
        gsap.to("#fanart-ui", {autoAlpha: 0, duration: 1});
        gsap.to(".scene-switch-btn", {autoAlpha: 0, duration: 1});

        tl2.timeScale(2).reverse(0, true).then(function () {
            $("canvas").hide();
            $("#home").show();
            tl.play().then(function () {
                isEnteringPond = false;
            });
        });
    });


}

let newHeight, newWidth;
if (sceneHeight > sceneWidth) {
    newHeight = sceneHeight;
    newWidth = sceneHeight;// * (2003 / 1080);

} else {
    newHeight = sceneWidth * (1080 / 1920);
    newWidth = sceneWidth;
}

class Preloader extends Phaser.Scene {


    constructor() {
        super({key: "preloadScene"});
    }


    preload() {

        const t0 = performance.now();
        gsap.set("#progressFill", {attr: {y: innerHeight}});
        this.load.on("progress", function (value) {
            $(".loading-text").text(parseInt(value * 100) + "%");

            let newY = 1050 - (1050 * value);

            gsap.set("#progressFill", {attr: {y: newY}});

        });
        const that = this;
        $body.css("opacity", "1");

        this.load.on("complete", function () {
            const t1 = performance.now();
            console.log("Preload took " + (t1 - t0) + " milliseconds.");
            $("#loadingDuck > text").remove();
            $("#loadingDuckContainer").hide();
            $("canvas").hide();
            startHomepageAnimation();
            window.game.input.enabled = false;
            //}, 1500);
        });


        //Load sprite atlas
        this.load.multiatlas("TEMPLATE", templatej, "assets");

        // this.load.multiatlas("TEMPLATE", "assets/TEMPLATE.json", "assets");
        this.load.multiatlas("pondbatch-1", "assets/pondbatch-1.json", "assets");
        this.load.multiatlas("legs", legsj, "assets");
        this.load.multiatlas("splash", splashj, "assets");

        //Load audio files
        let sounds = soundsj.sounds;
        let soundsLen = sounds.length;
        for (let i = 0; i < soundsLen; i++) {
            this.load.audio("suba_" + i, "assets/" + sounds[i]);
        }
        this.load.audio("bgm", "assets/bgm.mp3");
        // this.load.image("tiles", "assets/pond_vibrant_1920x1080.jpg");

        if (IS_MOBILE) {
            this.load.image("tiles", "assets/Subapond_vibrant_1024x1024.jpg");
            this.load.tilemapTiledJSON("map", pond_1024);

        } else {
            this.load.image("tiles", "assets/Subapond_vibrantHD-min.jpg");
            this.load.image("col", "assets/pond_color_invert.png");
            this.load.tilemapTiledJSON("map", pondTileJson);
        }
    }

    create() {

        this.makeSounds();
        this.sound.play("bgm");
        this.makeVolumeButton();
    }

    makeSounds() {
        let sounds = soundsj.sounds;
        let numberOfSounds = sounds.length;
        for (let i = 0; i < numberOfSounds; i++) {
            this.sound.add("suba_" + i);
        }
        this.sound.add("bgm");
    }

    makeVolumeButton() {
        //volume toggler
        let scene = this;
        $("#ponds-volume").on("click", function () {
            isMuted = !isMuted;
            if (isMuted) {
                document.getElementById("ponds-volume").style.backgroundImage = "url(../assets/Little_Megaphone_no_volume_v2.png)";
            } else {
                document.getElementById("ponds-volume").style.backgroundImage = "url(../assets/Little_Megaphone_volume.png)";
            }
            scene.sound.setMute(isMuted);
        });
    }

}

class SubatomoPond extends Phaser.Scene {
    // jshint ignore:line
    constructor() {
        // console.log("mygame constructor called");
        super({
            key: "pond",
            active: true,

        });
    }


    preload() {


        // this.load.image("tiles", "assets/pond_vibrant_1920x1080.jpg");
        this.listOfDucks = [];

        // this.load.image("grassVibrant", "assets/grass_vibrant_1920x1080.png");
        // this.load.image("waterVibrant", "assets/water_vibrant_1920x1080.png");
        // this.load.image("camerafilter", "assets/camerafilter.png");

        // this.add.image(0, 0, 'tiles')
        this.currentPond = 1;
        this.maxPond = submissions.submissions[submissions.submissions.length - 1].pond;


    }

    create() {
        let that = this;
        /*     let fanart = this.scene.get("fanart");

             $("#ponds-to-fanart").on("click", function () {
                 console.log("#ponds-to-fanart click");
                 // if (fanart.initialized == false) {
                 //     fanart.createSubmissions();
                 // }
                 // that.startFanartPondTransitionAnimation();
                 that.scene.switch(that.scene.get("fanart"));
             });*/

        let pondManager = this.scene.get("pond-manager");
        pondManager.events.on(
            "reloadDuckPond",
            function () {
                console.log("Populating ducks for pond #" + this.currentPond);
                let key = "pondbatch-" + Math.ceil(this.currentPond / 5);

                this.populateDucks(this.currentPond);
                this.applyTileCollisionCallbacks();
                last_collision_check = COLLISION_CHECK_RATE - 1;
            },
            this
        );


        this.makeTileMap();
        if (!IS_MOBILE)
            this.addGhostTexture();
        this.setBoundsAndPanCamera();

        this.addPondClick();
        //apply collision callbacks and populate ducks moved into pancamera

        // this.populateDucks(currentPond);
        this.makeWalkingAnimationFrames();
        this.makeSplashAnimationFrames();
        this.makeDuckAnimationFrames("TEMPLATE", "TEMPLATE");
        this.generatePondUI();
        // this.applyCollisions();
        this.input.on("gameobjectup", this.onObjectClicked);

        let totalNumSubmissions = submissions["submissions"].length;
        console.log(`Wow, ${totalNumSubmissions} in ${Math.ceil(totalNumSubmissions / 20)} ponds!!!`);

        game.scale.setGameSize(sceneWidth, sceneHeight);
        // game.scale.setGameSize(newWidth, newHeight);
    }

    makeTileMap() {
        this.map = this.make.tilemap({key: "map"}); //, tileWidth: 64, tileHeight: 64 });
        window.map = this.map;
        let tileset;
        if (IS_MOBILE) {
            tileset = this.map.addTilesetImage("Subapond_vibrant_1024x1024", "tiles");
        } else {
            tileset = this.map.addTilesetImage("Subapond_vibrantHD-min", "tiles");
        }
        window.tileset = tileset;
        // let tileset = this.map.addTilesetImage("pond_vibrant_1920x1080", "tiles");
        groundLayer = this.map.createLayer("ground", tileset);
        groundLayer.setCollisionByProperty({collides: true});
        pondLayer = this.map.createLayer("pond", tileset);
        pondLayer.setCollisionByProperty({collides: true});
        obstacleLayer = this.map.createLayer("obstacle", tileset);
        obstacleLayer.setCollisionByProperty({collides: true});
        let that = this;
        let layers = [groundLayer, pondLayer, obstacleLayer];

        if (!IS_MOBILE) {
            transitionLayer = this.map.createLayer("transition", tileset);
            transitionLayer.setCollisionByProperty({collides: true});
            layers.push(transitionLayer);
        }

        console.log(`pond size (${innerWidth}, ${innerHeight})->(${newWidth}, ${newHeight})`);

        layers.forEach(function (l) {
            l.setDisplaySize(newWidth, newHeight);
            l.alpha = 0;
        });
        if (!IS_MOBILE) {
        }

        let pondImg = this.add.image(newWidth / 2, newHeight / 2, "tiles");
        pondImg.setDisplaySize(newWidth, newHeight);
        pondImg.setOrigin(0.5);

        /*     if (IS_MOBILE) {
                 let pondImg = this.add.image(0, 0, "tiles");
                 pondImg.setOrigin(0.5,0);
             } else {  }*/

    }

    addGhostTexture() {
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

    setBoundsAndPanCamera() {
        let cam = this.cameras.main;
        let wv = cam.worldView;
        let that = this;
        if (true) {// (IS_MOBILE) {
            // console.log("camera panning");
            // this.cameras.main.pan(newWidth * 0.43, newHeight / 2, 0, "none", true);
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
                    that.populateDucks(this.currentPond);
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
            this.populateDucks(this.currentPond);
            this.applyTileCollisionCallbacks();

        }


    }


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

            if (!IS_MOBILE) {
                //transition
                that.physics.add.overlap(gameObject.legsOverlay, transitionLayer);
                //Check collision on tiles that need more precise checking by comparing a pixel on legs against a 'collision map'
                transitionLayer.setTileIndexCallback(
                    transitionTileIndices,
                    function (legs) {

                        if (last_collision_check < COLLISION_CHECK_RATE) return;
                        try {
                            let colorAtPosn = that.textures.getPixel(legs.body.x, legs.body.y, "ghostCollision");
                            let isInWater = colorAtPosn.r < 100;
                            // console.log(`${context.displayName} : x${context.legsOverlay.body.x}, y${context.legsOverlay.body.y}, ${colorAtPosn.red}`);
                            legs.setVisible(!isInWater);
                            legs.duck.splashOverlay.setVisible(isInWater);
                        } catch (e) {
                            // console.log(e);
                        }
                    },
                    null,
                    this
                );
            }

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

    makeDuckAnimationFrames(atlaskey, filename) {
        animationNames.forEach((animationName) => {
            let animName = animationName[0];
            let startFrame = animationName[1];
            let endFrame = animationName[2];
            let frameNames = this.anims.generateFrameNames(atlaskey, {
                start: startFrame,
                end: endFrame,
                prefix: filename + "-",
                suffix: ".png",

            });

            this.anims.create({
                key: filename + "-" + animName,
                frames: frameNames,
                frameRate: FRAME_RATE,
                repeat: -1,
            });

            this.anims.once(Phaser.Animations.Events.ADD_ANIMATION, () => {
                // //insert 1 more frame of idle inbetween the walk frames
                let walkAnim = this.anims.get(filename + "-" + "walk");
                walkAnim.addFrameAt(1, this.anims.get(filename + "-" + "idle").getFrames());
            });
        });
    };

    //Fill pond number with their ducks
    populateDucks(pond = 1) {

        let that = this;
        console.log(`Populating ducks in pond #${pond}...`);
        //Get submission reference sheet from google sheet and filter by pond #
        const submissionsArray = submissions["submissions"];

        const ducks = submissionsArray.filter(function (obj) {
            return parseInt(obj.pond) === pond;
        });

        //Create sprite for ducks and add their animations
        for (let i = 0; i < ducks.length; i++) {

            let duckGameObject;
            let atlaskey = (ducks[i].image == "TEMPLATE") ? "TEMPLATE" : "pondbatch-" + Math.ceil(pond / 5);
            //Generate frame names

            if (!this.textures.exists(ducks[i].image)) {
                this.pauseMenu();
                duckGameObject = this.physics.add
                    .sprite(0, 0, "TEMPLATE", "TEMPLATE-0.png");
                duckGameObject.currentDuck = "TEMPLATE";
                //to load the texture
                if (!this.textures.exists(atlaskey))
                    this.load.multiatlas(atlaskey, "assets/" + atlaskey + ".json", "assets");

                this.load.once(Phaser.Loader.Events.COMPLETE, () => {

                    // console.log("duck", duckGameObject);
                    //var keyAnim=duckGameObject.anims.currentAnim.key.split("-");
                    //console.log("currentAnime",duckGameObject.anims.currentAnim.key);

                    duckGameObject.setTexture(atlaskey, ducks[i].image + "-0.png");

                    duckGameObject.currentDuck = ducks[i].image;
                    that.makeDuckAnimationFrames(atlaskey, ducks[i].image);

                    setTimeout(function () {
                        duckGameObject.animState = DUCK_STATES.START_IDLE;
                        that.tweens.add({
                            targets: duckGameObject.parentContainer,
                            alpha: 1,
                            duration: 1500,
                            ease: "Power2"
                        });
                    }, 100);
                    $(".pond-btn").prop("disabled", false);
                });
                this.load.start();
            } else {
                duckGameObject = this.physics.add.sprite(0, 0, atlaskey, ducks[i].image + "-0.png");

                setTimeout(function () {
                    duckGameObject.animState = DUCK_STATES.START_IDLE;
                    that.tweens.add({
                        targets: duckGameObject.parentContainer,
                        alpha: 1,
                        duration: 1500,
                        ease: "Power2"
                    });
                }, 100);
                duckGameObject.currentDuck = ducks[i].image;
                if (ducks[i] != "TEMPLATE")
                    this.makeDuckAnimationFrames(atlaskey, ducks[i].image);
            }

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
                getRandomIntInclusive(this.boundsRight * .25, this.boundsRight * .6),
                getRandomIntInclusive(newHeight * 0.3, newHeight * 0.7),
            );

            duckContainer = this.physics.add.existing(duckContainer);
            // duckContainer.body.collideWorldBounds = true;

            if (innerWidth > MOBILE_MAX_WIDTH) {
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
            duckGameObject.sound = ducks[i].sound == -1 ? getRandomInt(0, numberOfSounds) : ducks[i].sound;

            duckGameObject.setOrigin(0.5, 0.5);
            duckGameObject.displayWidth = SPRITE_WIDTH;
            duckGameObject.displayHeight = SPRITE_HEIGHT;

            duckGameObject.parentContainer.alpha = 0;

            // duckGameObject.body.overlapX = Math.floor(duckGameObject.body.x * 0.5);
            // duckGameObject.body.overlapY = Math.floor(duckGameObject.body.y * 0.9);
            // duckGameObject.body.syncBounds=true;


            //Starting swimming state (unused)
            duckGameObject.isSwimming = false;

            duckGameObject.animState = DUCK_STATES.START_IDLE;

            //Duck object = {strName,strImageName,numPondNumber}, matches submission json

            //Create animations
            // const animationNames = [['idle', 0, 0], ['walk', 1, 2], ['quack', 3, 3], ['swim-idle', 4, 4], ['swim', 5, 6], ['swim-quack', 7, 7]];
            //, ['swim-idle', 0, 0], ['swim', 1, 2], ['swim-quack', 3, 3]];


            let clickContainer = this.add.rectangle(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT, 0x6666ff, 0);
            clickContainer.duck = duckGameObject;
            duckContainer.add(clickContainer);
            clickContainer.gameObjectType = "duck";
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


            //Set OnUpdate to use animations
            duckGameObject.updateState = function (context, delta) {
                switch (context.animState) {
                case DUCK_STATES.START_IDLE:
                    context.play(context.currentDuck + "-idle");
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

                    context.play(context.currentDuck + "-walk");
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
                    context.play(context.currentDuck + "-quack");
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
        if (gameObject.name == "bg") {
            this.scene.events.emit("clearmessages");
            return;
        }
        const duck = gameObject.duck;
        if (duck == null) return;
        // if the text is already being displayed, do nothing
        if (duck.namePopup != null || duck.msgPopup != null)
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
        // $("#pondUIContainer").append("<div style='display:none;' class='ui-img' id='pond-ui'><div class='inner-ui'></div></div>");
        let carousel = $("#pond-carousel");

        let pondsPerPage = 5;
        let totalPages = Math.ceil(this.maxPond / pondsPerPage);
        let pondNumber = 0;

        for (let i = 0; i < totalPages; i++) {
            let id = `carousel-ducks-${i}`;
            carousel.append(`<div class="carousel-cell button-list" id="${id}"></div>`);
            for (let j = 0; j < pondsPerPage; j++) {
                pondNumber += 1;
                $(`#${id}`).append(`<button class="pond-btn" pond="${pondNumber}">${pondNumber}</button>`);
                if (pondNumber == this.maxPond) {
                    break;
                }
            }
        }
        $(".pond-btn[pond=1]").addClass("selectedPond");
        setTimeout(function () {
            const $carouselPond = $("#pond-carousel");
            $carouselPond.flickity({
                prevNextButtons: false,
                pageDots: false,
                freeScroll: true,
                wrapAround: true
            });
            $("#duck-pond-previous").on("click", function () {
                $carouselPond.flickity("previous");
            });
            $("#duck-pond-next").on("click", function () {
                $carouselPond.flickity("next");
            });
        }, 1000);
    }

    updatePagination() {
        $(".pond-btn").removeClass("visible");
        for (let i = 0; i < pondsPerPage; i++) {
            let pondnum = currentPondPagination * pondsPerPage + i;
            $(`.pond-btn[pond=${pondnum}]`).addClass(
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
                // console.error(e);
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

    pauseMenu() {
        $(".pond-btn").prop("disabled", true);

    }
}

class PondManager extends Phaser.Scene {
    constructor() {
        // console.log("pond manager constructor");
        super({key: "pond-manager", active: true});
        this.duckPondNum = 1;
        this.fanartPondNum = 1;

        this.activeMessagesEvents = [];
        this.activeMessagesDuck = [];
        this.activeMessagesPanel = [];
        this.sceneSwitchBtn = $(".scene-switch-btn");
        this.activeScene = "pond";
        this.duckPond = null;
        this.fanartPond = null;

    }

    preload() {
        this.load.image("messagePanel", "assets/Window_resized.png");
        this.load.image("namePanel", "assets/NameHeader_resized.png");
        this.load.image("starsGroup", "assets/Stars_resized.png");
        this.load.image("starBG", "assets/Star_bg_reszied.png");
        this.load.image("megaphone", "assets/megaphone_resized.png");

        // if (innerWidth < 900) {
        //     this.cameras.main.pan(newWidth * 0.43, newHeight / 2, 0, "none", true);
        //
        // }
    }

    switchScene(from, to) {
        let fromScene = this.scene.get(from);
        fromScene.scene.transition({target: to, duration: 1500, sleep: true, moveAbove: true});
        this.activeScene = to;
        /*        this.cameras.main.fadeOut(500, 0, 0, 0);
    /*        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                   this.time.delayedCall(1000, () => {
                       this.cameras.main.fadeIn(500, 0, 0, 0);
                   });
               });
               this.cameras.main.once(Phaser.Cameras.Scene2d.Events.FADE_IN_COMPLETE, (cam, effect) => {
                   cam.resetFX();
               });*/
    }

    toFanartTransitionAnimation() {
        let tl = gsap.timeline();
        //fade in art duck
        tl.to(".fanart-splash", {autoAlpha: 1, duration: 1}, 0);
        //fade out pond ui
        tl.to("#ponds-to-fanart", {autoAlpha: 0, duration: 2}, 0);
        tl.to("#pond-ui", {autoAlpha: 0, duration: 2}, 0);

        //fade out art duck
        tl.to(".fanart-splash", {autoAlpha: 0, duration: 1}, 2);
        //fade in fanart ui
        tl.to("#fanart-ui", {autoAlpha: 1, duration: 2}, 2);
        tl.to("#ponds-to-ducks", {autoAlpha: 1, duration: 2}, 2).then(() => {
            $(".pond-btn").removeClass("selectedPond");
            $(`.pond-btn[pond=${this.fanartPond.currentPond}]`).addClass("selectedPond");
            $("#ponds-logo-home").attr("locked", "false");
            $(".scene-switch-btn").attr("locked", "false");
        });

        // tl.set(".scene-switch-btn", {attr: {locked: "false"}}, 10);
        // tl.set("#ponds-logo-home", {attr: {locked: "false"}}, 10);

    }

    toDucksTransitionAnimation() {
        let tl = gsap.timeline();
        //fade in loadingduck
        $("#loadingDuckContainer").show();
        tl.to("#loadingDuckContainer", {autoAlpha: 1, duration: 2}, 0);
        //fade out fanart ui
        tl.to("#fanart-ui", {autoAlpha: 0, duration: 2}, 0);
        tl.to("#ponds-to-ducks", {autoAlpha: 0, duration: 2}, 0);

        //fadeout loadingduck
        tl.to("#loadingDuckContainer", {autoAlpha: 0, duration: 2}, 2);
        //fade in pond ui
        tl.to("#pond-ui", {autoAlpha: 1, duration: 2}, 2);
        tl.to("#ponds-to-fanart", {autoAlpha: 1, duration: 2}, 2).then(() => {
            $(".pond-btn").removeClass("selectedPond");
            $(`.pond-btn[pond=${this.duckPond.currentPond}]`).addClass("selectedPond");
            $("#ponds-logo-home").attr("locked", "false");
            $(".scene-switch-btn").attr("locked", "false");
            $("#loadingDuckContainer").hide();
        });

        // tl.set(".scene-switch-btn", {attr: {locked: "false"}}, 10);
        // tl.set("#ponds-logo-home", {attr: {locked: "false"}}, 10);

    }


    create() {

        let that = this;
        $body.on("click", ".pond-btn", function () {
            $(".pond-btn").removeClass("selectedPond");
            $(this).addClass("selectedPond");
            if (that.activeScene == "pond")
                that.loadDuckPond(parseInt($(this).attr("pond")));
            else {
                that.loadFanartPond(parseInt($(this).attr("pond")));

            }
        });
        /*        $body.on("click", ".load-pond", function () {
                    $(".load-pond").removeClass("selectedPond");
                    $(this).addClass("selectedPond");
                    // console.log($(this).attr("pond"));
                    that.loadPond(parseInt($(this).attr("pond")));
                });*/

        this.duckPond = this.scene.get("pond");
        this.fanartPond = this.scene.get("fanart");


        this.sceneSwitchBtn.on("click", function () {
            console.log("scene switch button clicked");
            if ($(this).attr("locked") == "true")
                return;
            $(this).attr("locked", "true");
            $("#ponds-logo-home").attr("locked", "true");
            if (that.scene.manager.isActive("pond") && !(that.scene.manager.isActive("fanart"))) {
                that.toFanartTransitionAnimation();
                that.switchScene("pond", "fanart");
            } else {
                that.toDucksTransitionAnimation();
                that.switchScene("fanart", "pond");
            }

        });


        // this.scene.add.text();
        // uiscene.add.text();
        this.duckPond.events.on("clearmessages", function () {

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
                that.duckPond.time.addEvent({
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

        this.duckPond.events.on("duckclick", this.makeMessage, this);


        this.scene.bringToTop();
    }

    makeMessage(gameObject) {

        let x = gameObject.parentContainer.x - (SPRITE_WIDTH / 2);
        let y = gameObject.parentContainer.y - (SPRITE_HEIGHT / 2);
        let messagePanel, namePanel;


        if (IS_MOBILE) {
            messagePanel = this.duckPond.add.container();
        } else {
            messagePanel = this.duckPond.add.container(x - 50, y - 120);
        }
        //let img = pond.add.image(0, 0, "panel");

        namePanel = this.duckPond.add.container(0, 0);

        let name = this.duckPond.add.text(8, 6, gameObject.displayName, {
            fontFamily: "meyro",
            fontSize: "14px",
            color: "#000",
            stroke: "#000",
            strokeThickness: 1, padding: {x: 2, y: 2}
        });
        gameObject.namePopup = name;

        let msg = this.duckPond.add.text(0, name.displayHeight + 12, gameObject.message, MSG_TEXT_CONFIG);
        //console.log("mensaje",msg,img);
        gameObject.msgPopup = msg;


        let panelImg = this.duckPond.add.nineslice(
            -10, -10,   // this is the starting x/y location
            Math.max(name.displayWidth, msg.displayWidth, 286), Math.max(msg.displayHeight + name.displayHeight + 30, 156),   // the width and height of your object
            "messagePanel", // a key to an already loaded image
            16,         // the width and height to offset for a corner slice
            10          // (optional) pixels to offset when computing the safe usage area
        );

        let nameImg = this.duckPond.add.nineslice(
            6, 6,
            Math.max(name.displayWidth + 10, 108), Math.max(name.displayHeight + 4, 27),
            "namePanel",
            8,
            2
        );
        let starBG = this.add.image(panelImg.displayWidth - 10, 0, "starBG");
        starBG.setOrigin(1, 0);
        let starsGroup = this.add.image(panelImg.displayWidth, -10, "starsGroup");
        starsGroup.setOrigin(1, 0);
        let megaphone = this.add.image(panelImg.displayWidth, panelImg.displayHeight + 10, "megaphone");
        megaphone.setOrigin(1, 1);
        console.log("panelimg displayheight", panelImg.displayHeight);


        namePanel.add(nameImg);
        namePanel.sendToBack(nameImg);
        namePanel.add(name);
        name.setOrigin(0);

        messagePanel.add(panelImg);
        messagePanel.add(starBG);
        messagePanel.add(starsGroup);
        messagePanel.add(megaphone);
        messagePanel.add(msg);
        messagePanel.add(namePanel);

        panelImg.setOrigin(0, 0);
        messagePanel.sendToBack(panelImg);
        messagePanel.setDepth(9999);
        messagePanel.setAlpha(0);

        if (IS_MOBILE) {
            if (x > this.duckPond.boundsMidPtX) {
                if (panelImg.displayWidth > this.duckPond.halfWidth)
                    messagePanel.setPosition(Math.max(this.duckPond.boundsLeft, this.duckPond.boundsRight - panelImg.displayWidth), y - SPRITE_HEIGHT);
                else
                    messagePanel.setPosition(x, y - SPRITE_HEIGHT);
            } else {
                // console.log(sceneWidth * .48 + 100, x - 50);
                messagePanel.setPosition(this.duckPond.boundsLeft, y - SPRITE_HEIGHT);//pond.boundsBot / 2);
            }
        }

        this.tweens.add({
            targets: messagePanel,
            alpha: 1,
            duration: 1000,
            ease: "linear"
        }, this);

        // console.log(name);
        // console.log(img);
        let fadeout = this.duckPond.time.addEvent({
            delay: USERNAME_DISPLAY_DURATION - 1000,
            callback: function () {
                this.tweens.add({
                    targets: messagePanel,
                    alpha: 0,
                    duration: 1000,
                    ease: "linear"
                }, this);
                that.activeMessagesEvents = arrayRemove(that.activeMessagesEvents, fadeout);
            },
            callbackScope: this.duckPond,
        });

        let that = this;

        let destroy = this.duckPond.time.addEvent({
            delay: USERNAME_DISPLAY_DURATION,
            callback: function () {
                messagePanel.destroy();
                // this.namePopup.destroy();
                this.namePopup = null;
                // this.msgPopup.destroy();
                this.msgPopup = null;
                // img.destroy();
                that.activeMessagesDuck = arrayRemove(that.activeMessagesDuck, this);
                that.activeMessagesPanel = arrayRemove(that.activeMessagesPanel, messagePanel);
                that.activeMessagesEvents = arrayRemove(that.activeMessagesEvents, destroy);
            },
            callbackScope: gameObject,
        });

        this.activeMessagesEvents.push(fadeout);
        this.activeMessagesEvents.push(destroy);
        this.activeMessagesDuck.push(gameObject);
        this.activeMessagesPanel.push(messagePanel);

    }

    loadDuckPond(id) {
        if (this.duckPondNum == id) {
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

        this.duckPondNum = id;
        pond.currentPond = this.duckPondNum;
        this.events.emit("reloadDuckPond");
    }

    loadFanartPond(id) {
        if (this.fanartPondNum == id) {
            return;
        }
        this.fanartPond.listOfBoats.forEach(function (boat) {
            boat.destroy();
        });
        this.fanartPond.listOfBoats = [];
        // emit event to reload the ducks

        this.fanartPondNum = id;
        this.fanartPond.currentPond = this.fanartPondNum;
        this.events.emit("reloadFanartPond");
    }
}

class FanartPond extends Phaser.Scene {
    constructor() {
        super({
            key: "fanart",
            active: false,

        });
        this.initialized = false;
        this.fanartWindow = $("#fanart");
        this.fanartDisplay = $("#fanart-window-display");
        this.fanartSocial = $("#fanart-social-icon");
        this.fanartName = document.getElementById("fanart-name");
        this.fanartMessage = document.getElementById("fanart-message");
        this.fanartLink = $("#fanart-link");
        this.fanartImage = $("#fanart-image");
        this.listOfBoats = [];

        this.boatLocations = [{x: sceneWidth * 0.5, y: sceneHeight * 0.5},
            {x: sceneWidth * 0.25, y: sceneHeight * 0.5},
            {x: sceneWidth * 0.4, y: sceneHeight * 0.6},

            {x: sceneWidth * 0.7, y: sceneHeight * 0.65},
            {x: sceneWidth * 0.3, y: sceneHeight * 0.65},
            {x: sceneWidth * 0.8, y: sceneHeight * 0.5}
        ];

        $("#fanart .modal-close,#fanart .modal-bg").on("click", function () {
            game.input.enabled = true;
            $("body > canvas").css("cursor", "initial");
        });
        this.currentPond = 1;
    }

    preload() {
        console.log("fanart scene preload");
        this.load.multiatlas("boat", boatj, "assets",);
        this.load.multiatlas("explode", explodej, "assets",);
    }

    create() {
        this.maxPond = fanartSubmissions.submissions[fanartSubmissions.submissions.length - 1].pond;
        console.log("fanart scene create");
        let pondManager = this.scene.get("pond-manager");
        pondManager.events.on(
            "reloadFanartPond",
            function () {
                console.log("Populating fanarts for pond #" + this.currentPond);
                this.createSubmissions(this.currentPond);
            },
            this
        );
        this.makeBoatAnimations();
        let pondImg = this.add.image(newWidth / 2, newHeight / 2, "tiles");
        pondImg.setDisplaySize(newWidth, newHeight);
        pondImg.setOrigin(0.5);
        this.createSubmissions(this.currentPond);
        this.input.on("gameobjectup", this.onObjectClicked, this);
        this.generatePondUI();

    }

    makeBoatAnimations() {
        let idleFrameNames = this.anims.generateFrameNames("boat", {
            start: 0,
            end: 39,
            prefix: "Boat_",
            suffix: ".png",
        });
        this.anims.create({
            key: "boat-idle",
            frames: idleFrameNames,
            frameRate: FRAME_RATE,
            repeat: -1,
        });

        let explodeFrameNames = this.anims.generateFrameNames("explode", {
            start: 0,
            end: 13,
            prefix: "BoatExplode_",
            suffix: ".png",
        });
        this.anims.create({
            key: "boat-explode",
            frames: explodeFrameNames,
            frameRate: FRAME_RATE,
            repeat: 0,
        });
    }

    createSubmissions(pond, shuffle = true) {
        //Get submission reference sheet from google sheet and filter by pond #
        const fanartSubsArray = fanartSubmissions["submissions"];
        console.log(`Creating boats for pond #${pond}`);

        let fanartsByPond = fanartSubsArray.filter(function (obj) {
            return parseInt(obj.pond) === pond;
        });


        let locations = IS_MOBILE ? [...this.boatLocations] : [...this.boatLocations];


        for (let i = 0; i < fanartsByPond.length; i++) {

            if (shuffle)
                shuffleArray(locations);
            let posn = locations.pop();
            let x = (Math.random() > 0.5) ? 0.05 : -0.05;
            let y = (Math.random() > 0.5) ? 0.05 : -0.05;

            try {
                let newBoat = this.makeBoat(fanartsByPond[i], posn.x + x, posn.y + y);
                this.listOfBoats.push(newBoat);
            } catch (e) {
                console.log(e);
                console.log("ran out of spots to put a boat, make more spots");
            }
        }
    }

    makeBoat(fanart, x, y) {
        let fanartBoat = this.add.sprite(x, y, "boat", "Boat_0.png");

        fanartBoat.gameObjectType = "boat";
        fanartBoat.displayName = fanart.name;
        fanartBoat.filename = fanart.filename;
        fanartBoat.message = fanart.message;
        fanartBoat.fanartUsername = fanart.social;
        fanartBoat.fanartLink = fanart.link;
        fanartBoat.pond = fanart.pond;

        fanartBoat.setInteractive();
        fanartBoat.input.cursor = "pointer";
        // fanartBoat.input.hitArea.y += 25;
        fanartBoat.animState = BOAT_STATES.START_IDLE;

        fanartBoat.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "boat-explode", (animation, frame, gameObject, framekey) => {
            // console.log("boat-explode anim finish");
            this.onExplodeFinished(gameObject);
        });
        if (DEBUGGING) {
            this.input.enableDebug(fanartBoat, 0x04F404);
        }
        fanartBoat.updateState = function (context, delta) {
            switch (context.animState) {
            case BOAT_STATES.START_IDLE:
                context.play("boat-idle");
                context.animState = BOAT_STATES.IDLE;
                break;
            case BOAT_STATES.START_EXPLODE:
                context.play("boat-explode");
                context.animState = BOAT_STATES.EXPLODING;
                break;
            default:
                break;
            }
        };
        return fanartBoat;
    }

    onExplodeFinished(boat) {
        //gsap.to(this.fanartWindow, {autoAlpha: 1, duration: 1});
        setTimeout(function () {
            location.hash = "fanart";
            boat.animState = BOAT_STATES.START_IDLE;
        }, 100);
    }

    onObjectClicked(pointer, gameObject) {

        if (gameObject.gameObjectType == "boat") {
            // console.log("boat onclick");

            let boat = gameObject;

            this.fanartImage.prop("src", "assets/" + boat.filename + ".png");

            this.fanartSocial.removeClass();
            if (boat.fanartUsername.startsWith("@")) {
                this.fanartSocial.addClass("fab");
                this.fanartSocial.addClass("fa-twitter");
            } else if (boat.fanartLink.startsWith("#")) {

                this.fanartSocial.addClass("fas");
                this.fanartSocial.addClass("fa-ambulance");
            }
            if (boat.link != "") {
                this.fanartLink.prop("href", boat.fanartLink);
            }
            this.fanartName.textContent = boat.fanartUsername;
            this.fanartMessage.textContent = boat.message;
            boat.animState = BOAT_STATES.START_EXPLODE;
            game.input.enabled = false;
        }
    }

    update(time, delta) {
        let len = this.listOfBoats.length;
        for (let i = 0; i < len; i++) {
            try {
                let boatGO = this.listOfBoats[i];

                boatGO.updateState(boatGO, delta);

            } catch (e) {
                // console.error(e);
            }
        }
    }

    generatePondUI() {
        // console.log("generate pond ui");
        // $("#pondUIContainer").append("<div style='display:none;' class='ui-img' id='pond-ui'><div class='inner-ui'></div></div>");
        let carousel = $("#fanart-carousel");

        let pondsPerPage = 5;
        let totalPages = Math.ceil(this.maxPond / pondsPerPage);
        let pondNumber = 0;


        for (let i = 0; i < totalPages; i++) {
            let id = `carousel-fanart-${i}`;
            carousel.append(`<div class="carousel-cell button-list" id="${id}"></div>`);
            for (let j = 0; j < pondsPerPage; j++) {
                pondNumber += 1;
                $(`#${id}`).append(`<button class="pond-btn" pond="${pondNumber}">${pondNumber}</button>`);
                if (pondNumber == this.maxPond) {
                    break;
                }
            }
        }
        $(".pond-btn[pond=1]").addClass("selectedPond");
        setTimeout(function () {
            const $carouselFanart = $("#fanart-carousel");
            $carouselFanart.flickity({
                prevNextButtons: false,
                pageDots: false,
                freeScroll: true,
                wrapAround: true
            });


            $("#fanart-pond-previous").on("click", function () {
                $carouselFanart.flickity("previous");
            });
            $("#fanart-pond-next").on("click", function () {
                $carouselFanart.flickity("next");
            });
        }, 1000);
    }
}

const BOAT_STATES = {
    START_IDLE: 0, IDLE: 1, START_EXPLODE: 2, EXPLODING: 3
};

const config = {
    type: Phaser.CANVAS,
    width: innerWidth,
    height: innerHeight,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            // fps: 30,
            debug: DEBUGGING,
            gravity: {y: 0},
            tileBias: 120,
        },
    },
    backgroundColor: "#97CAFD",
    plugins: {
        global: [NineSlicePlugin.DefaultCfg],
    },

};

const game = new Phaser.Game(config);
game.scene.add("preloadScene", new Preloader());
game.scene.start("preloadScene");


window.game = game;
$("#home").hide();

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

$("#fanart-modal-bg").on("click", () => {
    if (window.game.input.enabled == false)
        game.input.enabled = true;
});
