const DEBUGGING = false;
import "./assets/css/style.css";

const ducksj = require("./assets/submissions/all_ducks_sheet.json");
const legsj = require("./assets/Duck Templates Resized/Duck Leg Cut/legs/legs.json");
const submissions = require("./assets/submissions/submissions.json");
const shuba = require("./assets/sound/suba_1.mp3");
require("phaser");

function importAll(r) {
    return r.keys().map(r);
}

let grassVibrant, waterVibrant;
require("./assets/Subapond vibrant/water_vibrant_1920x1080.png");
require("./assets/Subapond vibrant/grass_vibrant_1920x1080.png");

require("./assets/pond/pond1920x1035.png");
const pondTileJson = require("./assets/pond/pond.json");
importAll(require.context("./", true, /all_ducks_sheet.*\.(png|jpe?g|svg)$/));

const legs = importAll(require.context("./", true, /legs.*\.(png|jpe?g|svg)$/));
importAll(require.context("./", true, /pond.*\.(json)$/));

//Tile indices corresponding to water tiles in Tiled .tmx file
const pondTileIndices = [36, 37, 38, 39, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 63, 64, 65, 66, 67, 68, 69,
    70, 71, 72, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 94, 95, 96,];
const groundTileIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 44, 58, 59, 60, 61, 62, 73, 74, 75, 76, 77, 88, 89, 90, 91,
    92, 93, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,];
let pondLayer;
let groundLayer;
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
        function loading() {
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

            this.load.on("fileprogress", function (file) {
                //assetText.setText('Loading asset: ' + file.key);
                console.log(file.key);
            });

            this.load.on("complete", function () {
                setTimeout(function () {
                    let pondManager = that.scene.get("pond-manager");
                    pondManager.events.on(
                        "reloadPond",
                        function () {
                            that.populateDucks(currentPond);
                        },
                        that
                    );

                    that.shuba = that.sound.add("shuba");
                    that.populateDucks(currentPond);

                    that.generatePondUI();

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
        //Load audio files
        this.load.audio("shuba", shuba);
        this.load.image("tiles", "assets/pond1920x1035.png");
        this.load.tilemapTiledJSON("map", pondTileJson);

        let g = this.load.image("grassVibrant","assets/grass_vibrant_1920x1080.png");

        let w = this.load.image("waterVibrant","assets/water_vibrant_1920x1080.png");
        // this.add.image(0, 0, 'tiles')
    }

    create() {
        let pondManager = this.scene.get("pond-manager");
        pondManager.events.on(
            "reloadPond",
            function () {
                this.populateDucks(currentPond);
            },
            this
        );
        this.map = this.make.tilemap({key: "map"}); //, tileWidth: 64, tileHeight: 64 });
        let tileset = this.map.addTilesetImage("pond1920x1035", "tiles");

        groundLayer = this.map.createLayer("ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({collides: true});
        pondLayer = this.map.createLayer("pond", tileset, 0, 0);
        pondLayer.setCollisionByProperty({collides: true});

        waterVibrant=this.add.image(0,0,'waterVibrant');
        waterVibrant.setOrigin(0,0);
        grassVibrant=this.add.image(0,0,'grassVibrant');
        grassVibrant.setOrigin(0,0);

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
        this.shuba = this.sound.add("shuba");
        this.populateDucks(currentPond);
        this.generatePondUI();
    }

    //Fill pond number with their ducks
    populateDucks(pond = 1) {
        //Get submission reference sheet from google sheet and filter by pond #
        //{strName,strImageName,numPondNumber}
        const submissionsArray = submissions["submissions"];

        const ducks = submissionsArray.filter(function (obj) {
            return parseInt(obj.pond) === pond;
        });
        console.log(ducks);
        const groupConfig = {
            runChildUpdate: true,
        };

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
                .setDebug(true, false); //, new Phaser.Display.Color(255, 0, 0, 0));
            //Create GO group with duck and water overlay

            /*const waterOverlay = this.add.sprite(0, SPRITE_HEIGHT - 65, 'water', 'water1.png');
                  waterOverlay.setVisible(false);
                  waterOverlay.name = 'water'; */

            const legsOverlay = this.add.sprite(0, 0, "legs", "1.png");
            legsOverlay.setVisible(true);
            legsOverlay.name = "legs";

            duckContainer.add(legsOverlay);
            duckContainer.add(duckGameObject);
            // duckContainer.add(waterOverlay);
            duckContainer.name = "duckcontainer";
            // legsOverlay.parentContainer=duckContainer;

            //Init duck GO properties
            duckGameObject.parent = duckContainer;
            duckGameObject.name = "duck";
            // duckGameObject.waterOverlay = waterOverlay;
            duckGameObject.legsOverlay = legsOverlay;
            duckGameObject.displayName = ducks[i].name;
            duckGameObject.setOrigin(0.5, 0.5);
            duckGameObject.width = SPRITE_WIDTH;
            duckGameObject.height = SPRITE_HEIGHT;
            // duckGameObject.body.syncBounds = true;
            duckGameObject.body.overlapX = Math.floor(duckGameObject.body.x * 0.5);
            duckGameObject.body.overlapY = Math.floor(duckGameObject.body.y * 0.9);

            //initialize collision on tiles
            pondLayer.setTileIndexCallback(
                pondTileIndices,
                function (context) {
                    // console.log("swimming");
                    context.isSwimming = true;
                    // context.waterOverlay.setVisible(true)
                    context.legsOverlay.setVisible(false);
                },
                this
            );
            this.physics.add.overlap(duckGameObject, pondLayer);
            groundLayer.setTileIndexCallback(
                groundTileIndices,
                function (context) {
                    // console.log("grounded")
                    context.isSwimming = false;
                    // context.waterOverlay.setVisible(false)
                    context.legsOverlay.setVisible(true);
                },
                this
            );
            this.physics.add.overlap(duckGameObject, groundLayer);

            //Starting swimming state
            duckGameObject.isSwimming = false;
            // duckGameObject.isSwimming = this.physics.overlap(duckGameObject, pondLayer);
            // if (duckGameObject.isSwimming != null)
            //     duckGameObject.animState = duckGameObject.isSwimming ? DUCK_STATES.START_SWIM_IDLE : DUCK_STATES.START_IDLE;
            duckGameObject.animState = DUCK_STATES.START_IDLE;
            // this.physics.overlap(duckGameObject, groundLayer);

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
            // const animationNames = [['idle', 0, 0], ['walk', 1, 2], ['quack', 3, 3], ['swim-idle', 4, 4], ['swim', 5, 6], ['swim-quack', 7, 7]];

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
                // console.log(context.displayName);
                // if (context.isSwimming)
                //     console.log(duckGameObject.displayName + " is swimming");
                // else
                //     console.log(duckGameObject.displayName + " is not swimming");

                context.body.debugShowBody = true;
                context.body.debugBodyColor = context.isSwimming
                    ? new Phaser.Display.Color(0, 177, 64, 255)
                    : new Phaser.Display.Color(255, 0, 0, 255);

                switch (context.animState) {
                    case DUCK_STATES.START_IDLE:
                        context.play(currentDuck + "-idle");
                        // if (!context.isSwimming)
                        context.legsOverlay.play("idle");
                        context.idleTime = getRandomInt(minIdle, maxIdle);
                        context.animState = DUCK_STATES.IDLE;
                        break;
                    case DUCK_STATES.IDLE:
                        context.idleTime -= delta;
                        if (context.idleTime <= 0) {
                            // context.animState = !context.isSwimming ? DUCK_STATES.START_WALKING : DUCK_STATES.START_SWIMMING;
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
                        context.animState = DUCK_STATES.WALKING;
                        break;
                    case DUCK_STATES.WALKING:
                        context.travelTime -= delta;
                        // if (context.isSwimming) {
                        //     context.animState = DUCK_STATES.SWIMMING;
                        //     context.play(currentDuck + '-swim');
                        // }
                        if (context.travelTime <= 0) {
                            // context.animState = context.isSwimming ? DUCK_STATES.START_SWIM_IDLE : DUCK_STATES.START_IDLE;
                            context.animState = DUCK_STATES.START_IDLE;
                        }
                        break;
                    case DUCK_STATES.START_QUACK:
                        if (context.tween) {
                            context.tween.stop();
                        }
                        context.play(currentDuck + "-quack");
                        if (!context.isSwimming) context.legsOverlay.play("quack");

                        that.shuba.play();
                        context.quackTime = QUACK_DURATION;
                        context.animState = DUCK_STATES.QUACK;
                        break;
                    case DUCK_STATES.QUACK:
                        context.quackTime -= delta;
                        if (context.quackTime <= 0) {
                            context.animState = DUCK_STATES.START_IDLE;
                        }
                        break;
                    /*
                                                  case DUCK_STATES.START_SWIM_IDLE:
                                                      context.play(currentDuck + "-swim-idle");
                                                      context.idleTime = getRandomInt(minIdle, maxIdle)
                                                      context.animState = DUCK_STATES.SWIM_IDLE;
                                                      break;
                                                  case DUCK_STATES.SWIM_IDLE:
                                                      context.idleTime -= delta;
                                                      if (context.idleTime <= 0) {
                                                          context.animState = context.isSwimming ? DUCK_STATES.START_SWIMMING : DUCK_STATES.START_WALKING;
                                                      }
                                                      break;
                                                  case DUCK_STATES.START_SWIMMING:
                                                      const destX = getRandomDestinationX(context.x, MAX_TRAVEL_DIST_X);
                                                      const destY = getRandomDestinationY(context.y, MAX_TRAVEL_DIST_Y);

                                                      context.flipX = destX <= context.x;
                                                      context.travelTime = getRandomInt(MIN_TRAVEL, MAX_TRAVEL_TIME);
                                                      context.tween = scene.tweens.add({
                                                          targets: context.parent,
                                                          x: destX,
                                                          y: destY,
                                                          duration: context.travelTime,
                                                          ease: 'Linear',
                                                      });

                                                      context.play(currentDuck + '-swim');
                                                      context.animState = DUCK_STATES.SWIMMING;
                                                      break;
                                                  case DUCK_STATES.SWIMMING:
                                                      context.travelTime -= delta;
                                                      if (!context.isSwimming) {
                                                          context.animState = DUCK_STATES.WALKING;
                                                          context.play(currentDuck + '-walk');
                                                      }
                                                      if (context.travelTime <= 0) {
                                                          context.animState = context.isSwimming ? DUCK_STATES.START_SWIM_IDLE : DUCK_STATES.START_IDLE;
                                                      }
                                                      break;
                                                  case DUCK_STATES.START_SWIM_QUACK:
                                                      if (context.tween) {
                                                          context.tween.stop();
                                                      }
                                                      context.play(currentDuck + "-swim-quack");
                                                      that.shuba.play();
                                                      context.quackTime = QUACK_DURATION;
                                                      context.animState = DUCK_STATES.SWIM_QUACK;
                                                      break;
                                                  case DUCK_STATES.SWIM_QUACK:
                                                      context.quackTime -= delta;
                                                      if (context.quackTime <= 0) {
                                                          context.animState = DUCK_STATES.START_SWIM_IDLE;
                                                      }
                                                      break;
                                                 */
                    default:
                        break;
                }
            };
            //end OnUpdate
        }

        this.input.on("gameobjectup", this.onObjectClicked);
    }

    onObjectClicked(pointer, gameObject) {
        // gameObject.animState = gameObject.isSwimming ? DUCK_STATES.START_SWIM_QUACK : DUCK_STATES.START_QUACK;
        gameObject.animState = DUCK_STATES.START_QUACK;
        if (gameObject.namePopup != null) return;
        gameObject.namePopup = gameObject.scene.make.text({
            x: gameObject.x,
            y: gameObject.y - 50,
            text: gameObject.displayName,
            style: {font: "20px monospace", fill: "#fff", align: "center"},
        });
        gameObject.namePopup.setOrigin(0.5, 0.5);
        console.log(gameObject.namePopup);

        gameObject.scene.time.addEvent({
            delay: USERNAME_DISPLAY_DURATION,
            callback: function () {
                this.namePopup.destroy();
                this.namePopup = null;
            },
            callbackScope: gameObject,
        });
    }

    generatePondUI() {
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
        console.log("max pages " + maxPages);
        pond.append("<button id='prevPage'>Prev</button>");
        pond.append("<button id='nextPage'>Next</button>");

        // pond.append("<h3>Move water pixel by 1</h3>");
        pond.append("<h3>Move legs by 1 pixel</h3>");

        pond.append("<button id='waterUp'>+</button>");
        pond.append("<button id='waterDown'>-</button>");

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
        console.log("max pages", maxPages);
        $("#nextPage").on("click", function () {
            if (currentPondPagination < maxPages - 1) {
                currentPondPagination++;
            } else {
                currentPondPagination = 0;
            }
            that.updatePagination();
        });
        this.updatePagination();
        this.adjustWater();
    }

    adjustWater() {
        let that = this;
        $("#waterUp").on("click", function () {
            let gOs = that.children.list;
            for (let i = 0; i < gOs.length; i++) {
                if (gOs[i].type == "Container") gOs[i].last.y -= 1;
            }
        });
        $("#waterDown").on("click", function () {
            let gOs = that.children.list;
            for (let i = 0; i < gOs.length; i++) {
                if (gOs[i].type == "Container") gOs[i].last.y += 1;
            }
        });
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
        let gameObjectList = this.children.list;
        let len = gameObjectList.length;
        for (let i = 0; i < len; i++) {
            let gameObject = gameObjectList[i];
            if (gameObject.type != "Container") {
                continue;
            }
            let duckContainer = gameObject;

            let duckGO = duckContainer.last;
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
        super({key: "pond-manager", active: true});
        this.pondNum = 1;
        this.infoText;
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
    parent: "phaser-example",
    width: sceneWidth,
    height: sceneHeight,
    transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: DEBUGGING,
            gravity: {y: 0}, // Top down game, so no gravity
            tileBias: 64,
        },
    },
    scene: [MyGame, PondManager],
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
