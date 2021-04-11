/*
import 'phaser';
import duck from './assets/base.png';
import ducksj from './assets/ducks.json';
import submissions from './assets/submissions/submissions.json';

*/

import './assets/css/style.css';

const ducksj = require('./assets/submissions/all_ducks_sheet.json');
const submissions = require('./assets/submissions/submissions.json')
const shuba = require('./assets/sound/suba.mp3')
require('phaser');

function importAll(r) {
    return r.keys().map(r);
}

const allDucks = importAll(require.context('./', true, /all_ducks_sheet.*\.(png|jpe?g|svg)$/));
const ponds = importAll(require.context('./', true, /pond.*\.(json)$/));

const FRAME_RATE = 10;

const USERNAME_DISPLAY_DURATION = 3000;

const SPRITE_WIDTH = 100;

const SPRITE_HEIGHT = 100;

const maxPond=		submissions.submissions[submissions.submissions.length-1].pond;

class MyGame extends Phaser.Scene {
    constructor() {
        super({key: 'pond', active: true});
    }

    preload() {
        function loading() {
            const progressBar = this.add.graphics();
            const progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(240, 270, 320, 50);

            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            const loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: 'Loading...',
                style: {
                    font: '20px monospace',
                    fill: '#ffffff'
                }
            });
            loadingText.setOrigin(0.5, 0.5);

            const percentText = this.make.text({
                x: width / 2,
                y: height / 2 - 5,
                text: '0%',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            percentText.setOrigin(0.5, 0.5);

            const assetText = this.make.text({
                x: width / 2,
                y: height / 2 + 50,
                text: '',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            assetText.setOrigin(0.5, 0.5);

            this.load.on('progress', function (value) {
                percentText.setText(parseInt(value * 100) + '%');
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(250, 280, 300 * value, 30);
            });

            this.load.on('fileprogress', function (file) {
                assetText.setText('Loading asset: ' + file.key);
            });

            this.load.on('complete', function () {
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
                assetText.destroy();
				$("canvas").hide();
				window.game.input.enabled=false;
				$("#screens").show();
				//$("#home").show();
            });
        }

        loading.call(this);

        //Load sprite atlas
        this.load.multiatlas('allDucks', ducksj, 'assets');
        //Load audio files
        this.load.audio('shuba', shuba);
    }

    create() {
        let pondManager = this.scene.get('pond-manager');
        pondManager.events.on('reloadPond', function () {
            this.populateDucks(currentPond);
        }, this);

        this.shuba = this.sound.add('shuba');
        this.populateDucks(currentPond);
		
		this.generatePondUI();
    }

    //Fill pond number with their ducks
    populateDucks(pond = 1) {
        //Get submission reference sheet from google sheet and filter by pond #
        //{strName,strImageName,numPondNumber}
        const submissionsArray = submissions['submissions'];
        const ducks = submissionsArray.filter(function (obj) {
            return obj.pond === pond;
        });
		console.log(ducks);
        //Create sprite for ducks and add their animations
        for (let i = 0; i < ducks.length; i++) {
            const duckGameObject = this.add.sprite(getRandomInt(0, sceneWidth), getRandomInt(0, sceneHeight), "allDucks", ducks[i].image+"-0.png");
            duckGameObject.name = "duck";
            duckGameObject.setOrigin(0.5, 0.5)
            duckGameObject.width = SPRITE_WIDTH;
            duckGameObject.height = SPRITE_HEIGHT;
            duckGameObject.displayName = ducks[i].name;


            //Duck object = {strName,strImageName,numPondNumber}, matches submission json
            duckGameObject.duck = ducks[i];
            const currentDuck = duckGameObject.duck.image;

            //Create animations
            const animationNames = [['idle', 0, 0], ['walk', 1, 2], ['quack', 3, 3]];
            //ghetto hardcoded
            //todo: change depending on frames of animation
            animationNames.forEach(animationName => {
                let frameNames = this.anims.generateFrameNames('allDucks', {
                    start: animationName[1], end: animationName[2],
                    prefix: currentDuck + '-',
                    suffix: '.png'
                });
                this.anims.create({key: currentDuck + '-'+animationName[0], frames: frameNames, frameRate: FRAME_RATE, repeat: -1});
            });

            //Set event for click/press
            duckGameObject.setInteractive();
            duckGameObject.input.cursor = 'pointer';
			console.log(duckGameObject.input.hitArea);
            duckGameObject.input.hitArea.setSize(duckGameObject.width, duckGameObject.height);
			duckGameObject.input.hitArea.y=duckGameObject.height*0.5+5;
            duckGameObject.state = duckStates.START_IDLE;
            let that = this;

            //Set OnUpdate to use animations
            duckGameObject.updateState = function (context, delta) {
                switch (context.state) {
                    case duckStates.START_IDLE:
                        context.play(currentDuck+"-idle");
                        context.idle = getRandomInt(minIdle, maxIdle)
                        context.state = duckStates.IDLE;
                        break;
                    case duckStates.IDLE:
                        context.idle -= delta;
                        if (context.idle <= 0) {
                            context.state = duckStates.START_WALKING;
                        }
                        break;
                    case duckStates.START_WALKING:
                        const destinationX = getRandomInt(0, sceneWidth);
                        const destinationY = getRandomInt(0, sceneHeight);

                        if (destinationX > context.x) {
                            context.scaleX = 1;
                        } else {
                            context.scaleX = -1;
                        }

                        const scene = context.scene;//.scene.get('pond');

                        context.tween = scene.tweens.add({
                            targets: context,
                            x: destinationX,
                            y: destinationY,
                            duration: getRandomInt(minWalkTime, maxWalkTime),
                            ease: 'Linear',
                            onComplete: function () {
                                arguments[1][0].state = duckStates.START_IDLE;
                            }
                        });

                        context.play(currentDuck+'-walk');

                        context.state = duckStates.WALKING;
                        break;
                    case duckStates.WALKING:

                        break;
                    case duckStates.START_QUACK:
                        if (context.tween) {
                            context.tween.stop();
                        }
                        context.play(currentDuck+"-quack");
                        that.shuba.play();
                        context.quack = 1600;
                        context.state = duckStates.QUACK;
                        break;
                    case duckStates.QUACK:
                        context.quack -= delta;
                        if (context.quack <= 0) {
                            context.state = duckStates.START_IDLE;
                        }
                        break;
                    default:

                        break;
                }
            };

            //this.input.enableDebug(duckGameObject, 0x04F404);

        }
        this.input.on('gameobjectup', onObjectClicked);

        function onObjectClicked(pointer, gameObject) {
            gameObject.state = duckStates.START_QUACK;
            if (gameObject.namePopup != null) return;
            gameObject.namePopup = gameObject.scene.make.text({
                    x: gameObject.x, y: gameObject.y - 50, text: gameObject.displayName,
                    style: {font: '20px monospace', fill: '#fff', align: 'center'}
                }
            );
            gameObject.namePopup.setOrigin(0.5, 0.5)
            console.log(gameObject.namePopup)

            gameObject.scene.time.addEvent({
                delay: USERNAME_DISPLAY_DURATION, callback: function () {
                    this.namePopup.destroy();
                    this.namePopup=null;
                }, callbackScope: gameObject
            });

        }
    }
	
	generatePondUI(){
		$("body").append("<div id='pond-ui'></div>");
		$("#pond-ui").append("<h3>Select pond</h3>");
		for(var a=0;a<maxPond;a++){
			$("#pond-ui").append("<button class='load-pond' pond='"+(a+1)+"'>"+(a+1)+"</button>");
			$(".load-pond[pond=1]").addClass("selectedPond");
		}
	}

    update(time, delta) {
        for (let i = 0; i < this.children.list.length; i++) {
            let gameObject = this.children.list[i];
            if (gameObject.name !== "duck") {
                continue;
            }
            gameObject.setDepth(gameObject.y);
            gameObject.updateState(gameObject, delta);
        }
    }
}

var currentPond = 1;

class PondManager extends Phaser.Scene {

    constructor() {
        super({key: 'pond-manager', active: true});
        this.pondNum = 1;
        this.infoText
    }

    preload() {

    }

    create() {
        this.infoText = this.add.text(10, 10, `Pond ${this.pondNum}`, {font: '48px Arial', fill: '#000000'});
        this.infoText.setInteractive();
        this.input.on('gameobjectup', this.clickHandler, this);
        this.infoText.input.cursor="pointer";
        console.log(this.scene);
		var that=this;
		$("body").on("click",".load-pond",function(){
			$(".load-pond").removeClass("selectedPond");
			$(this).addClass("selectedPond");
			console.log($(this).attr("pond"));
			that.loadPond(parseInt($(this).attr("pond")));
		});
    }

    clickHandler(pointer, obj) {
        console.log('Click');
        const pond = this.scene.get('pond');
        pond.children.shutdown();
        // emit event to reload the ducks
		
		
        this.pondNum = (this.pondNum) % maxPond + 1;
        currentPond = this.pondNum;
        this.events.emit('reloadPond');
        this.infoText.setText(`Pond ${this.pondNum}`);
    }
	
	loadPond(id){
		
		
		
		if(this.pondNum==id){
			return;
		}
		console.log("load pond "+id);
		 const pond = this.scene.get('pond');
        pond.children.shutdown();
        // emit event to reload the ducks
		
		
        this.pondNum = id;
        currentPond = this.pondNum;
        this.events.emit('reloadPond');
        this.infoText.setText(`Pond ${this.pondNum}`);
	}
}

let sceneWidth = window.innerWidth;
let sceneHeight = window.innerHeight -56;
let aspectRatio = sceneWidth / sceneHeight;
const REFERENCE_ASPECT_RATIO = 1.78;//16/9
/*window.addEventListener("resize", () => {
    sceneWidth = document.querySelector('#width');
    sceneHeight = document.querySelector('#height');

});*/

const minWalkTime = 1000;
const maxWalkTime = 4800;

const minIdle = 0;
const maxIdle = 5000;


const duckStates = {
    START_IDLE: 0,
    IDLE: 1,
    START_WALKING: 2,
    WALKING: 3,
    START_QUACK: 4,
    QUACK: 5
};

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: sceneWidth,
    height: sceneHeight,
    transparent: true,
    scene: [MyGame, PondManager]
};

const game = new Phaser.Game(config);
window.game=game;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
