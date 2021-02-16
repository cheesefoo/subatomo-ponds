import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import duck from './assets/base.png';
import fran from './assets/fran.png';
import ducksj from './assets/ducks.json';
import ducksi from './assets/ducks.png';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'pond', active: true});
    }

    preload ()
    {
        //this.load.image('logo', logoImg);
		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, 270, 320, 50);

		var width = this.cameras.main.width;
		var height = this.cameras.main.height;
		var loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		var percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		percentText.setOrigin(0.5, 0.5);

		var assetText = this.make.text({
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
			//$("canvas").hide();
			//$("#screens").show();
		});

		// this.load.image('logo', logoImg);
		this.load.spritesheet('duck', duck, { frameWidth: 100, frameHeight: 100 });

		this.load.atlas('pond1', ducksi, ducksj);


		this.load.audio('shuba', [ "./sound/suba.mp3" ]);
		// for (var i = 0; i < 5000; i++) {
			// this.load.image('logo'+i, logoImg);
		// }
    }

    create ()
    {
        // const logo = this.add.image(400, 150, 'logo');

        // this.tweens.add({
            // targets: logo,
            // y: 450,
            // duration: 2000,
            // ease: "Power2",
            // yoyo: true,
            // loop: -1
        // });
		console.log(this);
		const shuba = this.sound.add('shuba');
		const SCENE=this;
		this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('duck',{frames:[1,2]}),
            frameRate: 24
        });

		this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('duck',{frames:[0]}),
            frameRate: 1
        });

		this.anims.create({
            key: 'cuack',
            frames: this.anims.generateFrameNumbers('duck',{frames:[3]}),
            frameRate: 1
        });

		// var sprite = this.add.sprite(getRandomInt(0,sceneWidth),getRandomInt(0,sceneHeight), 'pond1',"base (1).png");

		// console.log(sprite);

		// console.log("----");

		// var sprite2 = this.add.sprite(getRandomInt(0,sceneWidth),getRandomInt(0,sceneHeight), 'duck');
		// console.log(sprite2);

		let pondManager = this.scene.get('pond-manager');

		pondManager.events.on('reloadPond', function() {
			this.populateDucks();
		}, this);

		this.populateDucks();
    }

	populateDucks() {
		for(var a=0;a<30;a++){

			var sprite = this.add.sprite(getRandomInt(0,sceneWidth),getRandomInt(0,sceneHeight), 'duck');
			// var sprite = this.add.sprite(getRandomInt(0,sceneWidth),getRandomInt(0,sceneHeight), 'pond1',"base (1).png");
			console.log("entra");
			sprite.setInteractive();
			this.input.on('gameobjectup', function (pointer,context) {
				//console.log(pointer);
				context.state=duckStates.START_CUACK;
			});

			sprite.state=duckStates.START_IDLE;
			sprite.updateState=function(context,delta){
				//console.log(context.state);
				switch(context.state){
					case duckStates.START_IDLE:
						context.play("idle");
						context.idle=getRandomInt(minIdle,maxIdle)
						context.state=duckStates.IDLE;
					break;
					case duckStates.IDLE:
						context.idle-=delta;
						if(context.idle<=0){
							context.state=duckStates.START_WALKING;
						}
					break;
					case duckStates.START_WALKING:
						var destinationX=getRandomInt(0,sceneWidth);
						var destinationY=getRandomInt(0,sceneHeight);

						if(destinationX>context.x){
							context.scaleX=1;
						}else{
							context.scaleX=-1;
						}

						var scene = this.scene.scene.get('pond');

						context.tween=scene.tweens.add({
							targets: context,
							x: destinationX,
							y:destinationY,
							duration: getRandomInt(minWalkTime,maxWalkTime),
							ease: 'Linear',
							onComplete: function () {
							// console.log('onComplete');
							// console.log(arguments);
							//arguments[1][0].play("idle");
								arguments[1][0].state=duckStates.START_IDLE;
							}
						});

						context.play({ key: 'walk', repeat: -1 });

						context.state=duckStates.WALKING;
					break;
					case duckStates.WALKING:

					break;
					case duckStates.START_CUACK:
						if(context.tween){
						context.tween.stop();
						}
						context.play({key:"cuack"});
						shuba.play();
						context.cuack=1600;
						context.state=duckStates.CUACK;
					break;
					case duckStates.CUACK:
						context.cuack-=delta;
						if(context.cuack<=0){
							context.state=duckStates.START_IDLE;
						}
					break;
					default:
						alter("cagada");
					break;
				}
			};
		}
	}

	update(time,delta){
		if(true){
		for(var a=0;a<this.children.list.length;a++){
			this.children.list[a].setDepth(this.children.list[a].y);
			this.children.list[a].updateState(this.children.list[a],delta);
		}
		}
	}
}


class PondManager extends Phaser.Scene {

	constructor() {
		super({key: 'pond-manager', active: true});
		this.pondNum = 1;
		this.infoText
	}

	preload ()
	{

	}

	create() {
		this.infoText = this.add.text(10, 10, `Pond ${this.pondNum}`, { font: '48px Arial', fill: '#000000' });
		this.infoText.setInteractive();
		this.input.on('gameobjectup', this.clickHandler, this);
		console.log(this.scene);
	}

	clickHandler(pointer, obj) {
		console.log('Click');
		var pond = this.scene.get('pond');
		pond.children.shutdown();
		// emit event to reload the ducks
		this.events.emit('reloadPond');
		this.pondNum = (this.pondNum) % 3 + 1;
		this.infoText.setText(`Pond ${this.pondNum}`);
	}
}

const sceneWidth=window.innerWidth;
const sceneHeight=window.innerHeight-3;

const minWalkTime=1000;
const maxWalkTime=4800;

const minIdle=0;
const maxIdle=5000;


const duckStates={
	START_IDLE:0,
	IDLE:1,
	START_WALKING:2,
	WALKING:3,
	START_CUACK:4,
	CUACK:5
};

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: sceneWidth,
    height: sceneHeight,
	transparent: true,
    scene: [MyGame, PondManager]
};

const game = new Phaser.Game(config);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}