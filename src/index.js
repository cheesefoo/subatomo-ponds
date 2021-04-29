const DEBUGGING = false;

function importAll(r) {
    return r.keys().map(r);
}

import "./assets/css/style.css";

const ducksj = require("./assets/submissions/all_ducks_sheet.json");
const legsj = require("./assets/Duck Templates Resized/Duck Leg Cut/legs/legs.json");
const submissions = require("./assets/submissions/submissions.json");
const splashj = require("./assets/pond/WaterSplashAnimation/splash.json")
const pondTileJson = require("./assets/pond/pond.json");

require('./assets/cameralayer.png')
require("phaser");
// require("./assets/Subapond vibrant/water_vibrant_1920x1080.png");
// require("./assets/Subapond vibrant/grass_vibrant_1920x1080.png");
require("./assets/pond/pond_vibrant_1920x1080.jpg");
require("./assets/pond/WaterSplashAnimation/splash.png");

importAll(require.context("./", true, /all_ducks_sheet.*\.(png|jpe?g|svg)$/));
importAll(require.context("./assets/Duck Templates Resized/Duck Leg Cut/legs/", true, /legs.*\.(png|jpe?g|svg)$/));
importAll(require.context("./", true, /pond.*\.(json)$/));
importAll(require.context("./assets/sound/", true, /suba.*\.(mp3|ogg|wav)$/));
//Tile indices corresponding to water tiles in Tiled .tmx file
// const pondTileIndices = [36, 37, 38, 39, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 63, 64, 65, 66, 67, 68, 69,
//     70, 71, 72, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 94, 95, 96,];
// const groundTileIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
//     26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 44, 58, 59, 60, 61, 62, 73, 74, 75, 76, 77, 88, 89, 90, 91,
//     92, 93, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,];
const groundTileIndices = [1, 2, 3, 4, 0, 9, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30, 33, 34, 35, 36, 37, 38, 43, 44, 45, 46, 47, 48, 51, 62, 63, 64, 79, 80, 81, 82, 83, 95, 96, 97, 98, 99, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141];
let obstacleTileIndices = [0, 5, 6, 7, 8, 10, 15, 16, 24, 25, 31, 32, 67, 128, 142, 143, 144]
let pondTileIndices = [0, 39, 40, 41, 42, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
let pondLayer;
let groundLayer;
let obstacleLayer;
let grassVibrant, waterVibrant;

const FRAME_RATE = 10;
const USERNAME_DISPLAY_DURATION = 3000;
const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const maxPond =
    submissions.submissions[submissions.submissions.length - 1].pond;
const QUACK_DURATION = 1600;

let sceneWidth = window.innerWidth;
let sceneHeight = window.innerHeight - 56;

const MIN_TRAVEL = 1000;
const MAX_TRAVEL_TIME = 5000;
const MAX_TRAVEL_DIST_X = sceneWidth / 4;
const MAX_TRAVEL_DIST_Y = sceneHeight / 4;
const minIdle = 0;
const maxIdle = 5000;
const WATER_SPRITE_HEIGHT = 45;

const TINT_TOP_COLOR = new Phaser.Display.Color(103, 103, 103, 255);
const TINT_BOTTOM_COLOR = new Phaser.Display.Color(0, 0, 0, 0);

let currentPond = 1;

let currentPondPagination = 0;
let pondsPerPage = 3;
let maxPages;

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

class MyGame extends Phaser.Scene {
    // jshint ignore:line
    constructor() {
        console.log('mygame constructor called')
        super({
            key: "pond",
            active: true,

            files: [
                /* splash screen and progress bar files could go here */
                {
                    key: "./images/1.png",
                    type: "image",
                },
            ],
        });
    }

    preload() {
        console.log('mygame preload');

        function loading() {
            console.log('loading call')
            var progressWidth = 320;

            const progressBar = this.add.graphics();
            const progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(
                sceneWidth * 0.5 - progressWidth * 0.5 - 10,
                sceneHeight * 0.5,
                progressWidth,
                50
            );

            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            const loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 55,
                text: "Loading...",
                style: {
                    font: "20px monospace",
                    fill: "#ffffff",
                },
            });
            loadingText.setOrigin(0.5, 0.5);

            const percentText = this.make.text({
                x: width / 2,
                y: height / 2 - 30,
                text: "0%",
                style: {
                    font: "18px monospace",
                    fill: "#ffffff",
                },
            });
            percentText.setOrigin(0.5, 0.5);

            this.load.on("progress", function (value) {
                percentText.setText(parseInt(value * 100) + "%");
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(
                    sceneWidth * 0.5 - progressWidth * 0.5,
                    sceneHeight * 0.5 + 10,
                    (progressWidth - 20) * value,
                    30
                );
            });

            var that = this;

            this.load.on("fileprogress", function (file, percentComplete) {
                //assetText.setText('Loading asset: ' + file.key);
                if (percentComplete === 1)
                    console.log(file.key);
            });

            this.load.on("complete", function () {
                setTimeout(function () {
                    let pondManager = that.scene.get("pond-manager");
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

                    progressBar.destroy();
                    progressBox.destroy();
                    loadingText.destroy();
                    percentText.destroy();
                    $("#loadingDuck").hide();
                    $("canvas").hide();
                    window.game.input.enabled = false;
                    $("#screens").show();
                }, 1500);
            });
        }

        loading.call(this);

        //Load sprite atlas
        this.load.multiatlas("allDucks", ducksj, "assets");
        this.load.multiatlas("legs", legsj, "assets");
        this.load.multiatlas("splash", splashj, "assets");
        //Load audio files
        this.load.audio("suba_1", "assets/suba_1.mp3");
        this.load.audio("suba_2", "assets/suba_2.mp3");
        this.load.image("tiles", "assets/pond_vibrant_1920x1080.jpg");
        this.load.tilemapTiledJSON("map", pondTileJson);
        this.listOfDucks = [];

        // this.load.image("grassVibrant", "assets/grass_vibrant_1920x1080.png");
        // this.load.image("waterVibrant", "assets/water_vibrant_1920x1080.png");
        // this.load.image("camerafilter", "assets/camerafilter.png");

        // this.add.image(0, 0, 'tiles')
    }

    create() {
        console.log('create call');
        // let shader = this.add.shader("camerafilter")
        // let gameObjectCamera = this.cameras.add();
        // gameObjectCamera.set
        let pondManager = this.scene.get("pond-manager");
        pondManager.events.on(
            "reloadPond",
            function () {
                this.populateDucks(currentPond);
            },
            this
        );

        this.makeTileMap();

        // waterVibrant = this.physics.add.image(0, 0, 'waterVibrant');
        // waterVibrant.setOrigin(0, 0);
        // // waterVibrant.setPipeline('Light2D');
        // grassVibrant = this.physics.add.image(0, 0, 'grassVibrant');
        // grassVibrant.setOrigin(0, 0);
        // grassVibrant.setPipeline('Light2D');

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // pondLayer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(23, 134, 177, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(255, 0, 255, 255) // Color of colliding face edges
        // });groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(44, 185, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(255, 0, 255, 255) // Color of colliding face edges
        // });

        this.makeWalkingAnimationFrames();
        this.makeSplashAnimationFrames();
        this.populateDucks(currentPond);
        this.generatePondUI();
        this.applyTileCollisionCallbacks();
        this.makeSounds();
        // this.applyCollisions();
        // this.lights.enable().setAmbientColor(0x828282);
        // let light = this.lights.addLight(0, 0, 200).setScrollFactor(0.0).setIntensity(1);
        // this.input.on('pointermove', function (pointer) {
        //     light.x = pointer.x;
        //     light.y = pointer.y;
        // });
        this.input.on("gameobjectup", this.onObjectClicked);

    }

    makeSounds() {
        this.suba1 = this.sound.add("suba_1");
        this.suba2 = this.sound.add("suba_2");
    }

    makeTileMap() {
        this.map = this.make.tilemap({key: "map"}); //, tileWidth: 64, tileHeight: 64 });
        let tileset = this.map.addTilesetImage("pond_vibrant_1920x1080", "tiles");
        groundLayer = this.map.createLayer("ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({collides: true});
        pondLayer = this.map.createLayer("pond", tileset, 0, 0);
        pondLayer.setCollisionByProperty({collides: true});
        obstacleLayer = this.map.createLayer("obstacle", tileset, 0, 0);
        obstacleLayer.setCollisionByProperty({collides: true});

    }

    applyCollisions() {
        let gameObjectList = this.children.list;
        let that = this;
        gameObjectList.forEach(function (gameObject) {
            if (gameObject.type === "Container") {
                let duckGO = gameObject.last;
                that.physics.add.overlap(duckGO, waterVibrant, function (context) {
                    console.log(context.displayName + " swimming");
                    context.isSwimming = true;
                    // context.waterOverlay.setVisible(true)
                    context.legsOverlay.setVisible(false);
                }, null, this);
                that.physics.add.overlap(duckGO, grassVibrant, function (context) {
                    console.log(context.displayName + " grounded");
                    context.isSwimming = false;
                    // context.waterOverlay.setVisible(true)
                    context.legsOverlay.setVisible(true);

                }, null, this);
            }
        });
    }

    applyTileCollisionCallbacks() {
        let gameObjectList = this.children.list;
        let that = this;
        gameObjectList.forEach(function (gameObject) {
            if (gameObject.type === "Container") {
                let duckGO = gameObject.last;
                pondLayer.setTileIndexCallback(
                    pondTileIndices,
                    function (context) {
                        // console.log("swimming");
                        context.isSwimming = true;
                        context.splashOverlay.setVisible(true);
                        context.legsOverlay.setVisible(false);
                    },
                    null,
                    this
                );
                that.physics.add.overlap(duckGO, pondLayer);
                groundLayer.setTileIndexCallback(
                    groundTileIndices,
                    function (context) {
                        // console.log("grounded")
                        context.isSwimming = false;
                        context.splashOverlay.setVisible(false);
                        context.legsOverlay.setVisible(true);
                    },
                    null,
                    this
                );
                that.physics.add.overlap(duckGO, groundLayer);
                // that.physics.add.collider(duckGO,obstacleLayer);

                that.physics.world.addCollider(duckGO, obstacleLayer, function (c) {
                    console.log(c.displayName + ' obstacle')
                }, null, this);

                //if duck enters a spot it shouldn't path, just tell it to stop
                //this is very bad, maybe one day ill fix it
                // obstacleLayer.setTileIndexCallback(obstacleTileIndices,
                //     function (context){
                //         context.travelTime=0;
                //     },null,this);

            }
        });
        if (DEBUGGING) {
            const debugGraphics = this.add.graphics().setAlpha(0.75);
            obstacleLayer.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
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
        //Get submission reference sheet from google sheet and filter by pond #
        //{strName,strImageName,numPondNumber}
        const submissionsArray = submissions["submissions"];

        const ducks = submissionsArray.filter(function (obj) {
            return parseInt(obj.pond) === pond;
        });

        //Create sprite for ducks and add their animations
        for (let i = 0; i < ducks.length; i++) {
            let duckContainer = this.add.container(
                getRandomInt(0, sceneWidth),
                getRandomInt(0, sceneHeight)
            );

            const duckGameObject = this.physics.add
                .sprite(0, 0, "allDucks", ducks[i].image + "-0.png")
                // .setCollideWorldBounds(true)
                // .setBounce(1, 1)
                .setDebugBodyColor(0x00FF)
                .setDebug(true, false, 0x00ff); //, new Phaser.Display.Color(255, 0, 0, 0));

            const legsOverlay = this.add.sprite(0, 0, "legs", "1.png");
            legsOverlay.setVisible(true);
            legsOverlay.name = "legs";

            const splashOverlay = this.add.sprite(0, 0, "splash", "0.png")
            splashOverlay.setVisible(false);
            splashOverlay.name = "splash";
            splashOverlay.setOrigin(0.5, 0.1);
            splashOverlay.setScale(0.6);

            duckContainer.name = "duckcontainer";
            duckContainer.add(legsOverlay);
            duckContainer.add(splashOverlay);
            duckContainer.add(duckGameObject);

            //Init duck GO properties
            duckGameObject.parent = duckContainer;
            duckGameObject.name = "duck";
            duckGameObject.legsOverlay = legsOverlay;
            duckGameObject.splashOverlay = splashOverlay;
            duckGameObject.displayName = ducks[i].name;
            duckGameObject.message = ducks[i].message;
            duckGameObject.sound = ducks[i].sound;

            duckGameObject.setOrigin(0.5, 0.5);
            duckGameObject.width = SPRITE_WIDTH;
            duckGameObject.height = SPRITE_HEIGHT;
            duckGameObject.setPipeline('Light2D');

            duckGameObject.body.overlapX = Math.floor(duckGameObject.body.x * 0.5);
            duckGameObject.body.overlapY = Math.floor(duckGameObject.body.y * 0.9);


            //Starting swimming state (unused)
            duckGameObject.isSwimming = false;

            duckGameObject.animState = DUCK_STATES.START_IDLE;

            //Duck object = {strName,strImageName,numPondNumber}, matches submission json
            duckGameObject.duck = ducks[i];
            const currentDuck = duckGameObject.duck.image;

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
            walkAnim.addFrameAt(
                1,
                this.anims.get(currentDuck + "-" + "idle").getFrames()
            );

            //Set event for click/press
            duckGameObject.setInteractive();
            duckGameObject.input.cursor = "pointer";
            // this.input.enableDebug(duckGameObject, 0x04F404);

            //Fix hitbox
            this.time.addEvent({
                delay: 1000,
                callback: function () {
                    duckGameObject.input.hitArea.setSize(
                        duckGameObject.width,
                        duckGameObject.height,
                        true
                    );
                    // duckGameObject.setSize(duckGameObject.width, duckGameObject.height);
                    duckGameObject.input.hitArea.y = duckGameObject.height / 2;

                    duckGameObject.body.setSize(80, 10, false);
                    duckGameObject.body.setOffset(10, 70);
                },
                callbackScope: this,
                loop: false,
            });

            let that = this;

            //Set OnUpdate to use animations
            duckGameObject.updateState = function (context, delta) {
                const scene = context.scene;

                context.body.debugShowBody = true;
                context.body.debugBodyColor = context.isSwimming
                    ? new Phaser.Display.Color(0, 177, 64, 255)
                    : new Phaser.Display.Color(255, 0, 0, 255);

                switch (context.animState) {
                    case DUCK_STATES.START_IDLE:
                        context.play(currentDuck + "-idle");
                        // if (!context.isSwimming)
                        context.legsOverlay.play("idle");
                        context.splashOverlay.play("splash-idle");
                        context.idleTime = getRandomInt(minIdle, maxIdle);
                        context.animState = DUCK_STATES.IDLE;
                        break;
                    case DUCK_STATES.IDLE:
                        context.idleTime -= delta;
                        if (context.idleTime <= 0) {

                            context.animState = DUCK_STATES.START_WALKING;
                        }
                        break;
                    case DUCK_STATES.START_WALKING:
                        const destinationX = getRandomDestinationX(
                            context.parent.x,
                            MAX_TRAVEL_DIST_X
                        );
                        const destinationY = getRandomDestinationY(
                            context.parent.y,
                            MAX_TRAVEL_DIST_Y
                        );

                        context.flipX = destinationX <= context.parent.x;
                        context.legsOverlay.flipX = destinationX <= context.parent.x;

                        context.travelTime = getRandomInt(MIN_TRAVEL, MAX_TRAVEL_TIME);
                        context.tween = scene.tweens.add({
                            targets: context.parent,
                            x: destinationX,
                            y: destinationY,
                            duration: context.travelTime,
                            ease: "Linear",
                        });

                        context.play(currentDuck + "-walk");
                        // if (!context.isSwimming)
                        context.legsOverlay.play("walk");
                        context.splashOverlay.play("splash-walk");
                        context.animState = DUCK_STATES.WALKING;
                        break;
                    case DUCK_STATES.WALKING:
                        context.travelTime -= delta;
                        if (context.travelTime <= 0) {
                            context.animState = DUCK_STATES.START_IDLE;
                        }
                        break;
                    case DUCK_STATES.START_QUACK:
                        if (context.tween) {
                            context.tween.stop();
                        }
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
        // if the text is already being displayed, do nothing
        if (gameObject.namePopup != null || gameObject.msgPopup != null)
            return;

        gameObject.animState = DUCK_STATES.START_QUACK;
        this.sound.play("suba_" + gameObject.sound);


        gameObject.namePopup = gameObject.scene.make.text({
            x: gameObject.x,
            y: gameObject.y - 50,
            text: gameObject.displayName,
            style: {font: "20px monospace", fill: "#fff", align: "center"},
        });
        gameObject.namePopup.setOrigin(0.5, 0.5);
        gameObject.msgPopup = gameObject.scene.make.text({
            x: gameObject.x,
            y: gameObject.y - 10,
            text: gameObject.message,
            style: {font: "20px monospace", fill: "#fff", align: "center"},
        });
        gameObject.msgPopup.setOrigin(0.5, 0.5);

        console.log(gameObject.msgPopup);

        gameObject.scene.time.addEvent({
            delay: USERNAME_DISPLAY_DURATION,
            callback: function () {
                this.namePopup.destroy();
                this.namePopup = null;
                this.msgPopup.destroy();
                this.msgPopup = null;
            },
            callbackScope: gameObject,
        });
    }

    generatePondUI() {
        console.log('generate pond ui')
        $("body").append("<div id='pond-ui'></div>");
        let pond = $("#pond-ui");
        pond.append("<h3>Select pond</h3>");
        pond.append("<div class='button-list'></div>");
        for (let a = 0; a < maxPond; a++) {
            $(".button-list").append(
                "<button class='load-pond' pond='" +
                (a + 1) +
                "'>" +
                (a + 1) +
                "</button>"
            );
        }
        maxPages = Math.ceil(maxPond / pondsPerPage);
        pond.append("<button id='prevPage'>Prev</button>");
        pond.append("<button id='nextPage'>Next</button>");


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
        for (let a = 0; a < pondsPerPage; a++) {
            $($(".load-pond")[currentPondPagination * pondsPerPage + a]).addClass(
                "visible"
            );
        }
    }

    update(time, delta) {
        //todo: find a way to call update on every duck without looping thru every single object every frame holy crap
        let len = this.listOfDucks.length;
        for (let i = 0; i < len; i++) {


            let duckGO = this.listOfDucks[i];
            duckGO.setDepth(duckGO.y);
            duckGO.updateState(duckGO, delta);
            // let tintIndex = Math.floor(100*(duckGO.body.transform.y / sceneHeight));
            // let tint = Phaser.Display.Color.Interpolate.ColorWithColor(TINT_TOP_COLOR, TINT_BOTTOM_COLOR, 100, tintIndex)
            // console.log(tint);
            // duckGO.setTint(tint);


        }
    }

    /*
      for (let i = 0; i < this.children.list.length; i++) {
              let gameObject = this.children.list[i];
              if (gameObject.name !== "duck") {
                  continue;
              }
              gameObject.setDepth(gameObject.y);
              gameObject.updateState(gameObject, delta);
          }

       */
}

class PondManager extends Phaser.Scene {
    constructor() {
        console.log('pond manager constructor')
        super({key: "pond-manager", active: true});
        this.pondNum = 1;

    }

    preload() {
    }

    create() {
        /*        this.infoText = this.add.text(10, 10, `Pond ${this.pondNum}`, {font: '48px Arial', fill: '#000000'});
                    this.infoText.setInteractive();
                    this.input.on('gameobjectup', this.clickHandler, this);
                    this.infoText.input.cursor="pointer";*/
        console.log(this.scene);
        let that = this;
        $("body").on("click", ".load-pond", function () {
            $(".load-pond").removeClass("selectedPond");
            $(this).addClass("selectedPond");
            console.log($(this).attr("pond"));
            that.loadPond(parseInt($(this).attr("pond")));
        });
    }

    clickHandler(pointer, obj) {
        console.log("Click");
        const pond = this.scene.get("pond");
        pond.children.shutdown();
        // emit event to reload the ducks

        this.pondNum = (this.pondNum % maxPond) + 1;
        currentPond = this.pondNum;
        this.events.emit("reloadPond");

        //this.infoText.setText(`Pond ${this.pondNum}`);
    }

    loadPond(id) {
        if (this.pondNum == id) {
            return;
        }
        console.log("load pond " + id);
        const pond = this.scene.get("pond");
        pond.children.shutdown();
        // emit event to reload the ducks

        this.pondNum = id;
        currentPond = this.pondNum;
        this.events.emit("reloadPond");
        //this.infoText.setText(`Pond ${this.pondNum}`);
    }
}

const config = {
    type: Phaser.CANVAS,
    width: sceneWidth,
    height: sceneHeight,
    transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: DEBUGGING,
            gravity: {y: 0}, // Top down game, so no gravity
            tileBias: 120,
        },
    },
    scene: [PondManager, MyGame],
};

const game = new Phaser.Game(config);
window.game = game;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDestinationX(startPos, maxDist) {
    let dist = 0;
    dist = getRandomInt(0, 1) == 1 ? -1 * maxDist : maxDist;
    let destination = getRandomInt(startPos, startPos + dist);
    if (destination < 0 || destination > sceneWidth)
        destination = getRandomDestinationX(startPos, maxDist);
    return destination;
}

function getRandomDestinationY(startPos, maxDist) {
    let dist = 0;
    dist = getRandomInt(0, 1) == 1 ? -1 * maxDist : maxDist;
    let destination = getRandomInt(startPos, startPos + dist);
    if (destination < 0 || destination > sceneHeight)
        destination = getRandomDestinationY(startPos, maxDist);
    return destination;
}
