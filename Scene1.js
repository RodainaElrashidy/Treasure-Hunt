class Scene1 extends Phaser.Scene {
    constructor() 
    {
        super("startScreen");
        this.canplay = false;
    }
    preload()
    {
        this.load.image("StartScreen", "Art/Level.png"); //the background image of the lvl
        this.load.image("Guide", "Art/Guide.png"); //the background image of the lvl
        this.load.image("Light", "Art/Light.png"); //the background image of the lvl
        this.load.audio("push", "Assets/push.mp3");

        this.load.spritesheet({
            key: 'player',
            url: 'Art/Player1.png',
            frameConfig: {
                frameWidth: 32,
                frameHeight: 33,
                startFrame: 0,
                endFrame: 48
            }
        })

        this.load.spritesheet({
            key: 'player2',
            url: 'Art/Player4.png',
            frameConfig: {
                frameWidth: 32,
                frameHeight: 33,
                startFrame: 0,
                endFrame: 48
            }
        })


    }

    create() {

        this.Guide = this.add.image(355, 355, "Guide");
        this.background = this.add.image(355, 355, "StartScreen");
        this.Light = this.add.image(355, 355, "Light");

        this.player = this.add.sprite(530, 423, "player").setScale(1.5);
        this.player2 = this.add.sprite(194, 423, "player2").setScale(1.5);

        this.anims.create({
            key: "idle_Left",
            frames: this.anims.generateFrameNumbers("player", { start: 24, end: 14 }),
            frameRate: 10,
            repeat: -1
        })


        this.anims.create({
            key: "idle_Right2",
            frames: this.anims.generateFrameNumbers("player2", { start: 25, end: 35 }),
            frameRate: 10,
            repeat: -1
        })

        this.player.anims.play("idle_Left", true);
        this.player2.anims.play("idle_Right2", true);

        this.tweens.add({
            targets: this.Light,
            alpha: 0,        // Target alpha value
            duration: 2000,  // Duration in milliseconds
            ease: 'Linear',
            yoyo: true,      // Yoyo makes the tween reverse, creating the pulsating effect
            repeat: -1       // -1 means the tween will repeat indefinitely
        });

        this.Music = this.sound.add("push")

        //not required but useful
        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.Music.play(musicConfig);
    }

    update() {
        let uInput = this.input.keyboard.createCursorKeys();
        //this.background.setAlpha(0.5);
         if (uInput.space.isDown && this.canplay == false) {
            this.background.destroy();
            this.Light.destroy();
            setTimeout(() =>  this.canplay = true, 300)

         }
         else if (uInput.space.isDown && this.canplay == true){
            this.Music.stop();
            this.scene.start("lvl1");
            console.log("pressed space");
         }
    }
}