class Scene2 extends Phaser.Scene {

    constructor() {
        super("lvl1");
        this.background;
        this.platforms;
        this.stars;
        this.Bomb;
        this.GreenKey;
        this.BlueKey;
        this.Chest;
        this.userInput;
        this.player;
        this.player2;
        this.player1Score = 0;
        this.player2Score = 0;
        this.Timer = 3;
        this.player1_direction = 0;
        this.player2_direction = 0;
        this.animationPlayed = false;
        this.move = true;
    }

    //preload
    preload() {
        this.load.image("bg", "Art/Background2.png"); //the background image of the lvl
        this.load.image("Ground1", "Art/Ground1.png");
        this.load.image("Ground2.1", "Art/Ground2.1.png");
        this.load.image("Ground2.2", "Art/Ground2.2.png");
        this.load.image("Ground3", "Art/Ground3.png");
        this.load.image("Celling", "Art/Celling.png");
        this.load.image("Block", "Art/Block.png");
        this.load.image("LeftWall", "Art/LeftWall.png");
        this.load.image("RightWall", "Art/RightWall.png");

        this.load.audio("bgM", "Assets/Drums.mp3");
        this.load.audio("jump", "Assets/jump_c_02-102843.mp3");
        this.load.audio("coin", "Assets/collectcoin-6075.mp3");
        this.load.audio("win", "Assets/success-fanfare-trumpets-6185.mp3");
        this.load.audio("boom", "Assets/boom.mp3");

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

        this.load.spritesheet({
            key: 'GreenKey',
            url: 'Art/GreenKey.png',
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 23
            }
        })

        this.load.spritesheet({
            key: 'BlueKey',
            url: 'Art/BlueKey.png',
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 23
            }
        })

        this.load.spritesheet({
            key: 'Bomb',
            url: 'Art/Bomb2.png',
            frameConfig: {
                frameWidth: 25,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 1
            }
        })

        this.load.spritesheet({
            key: 'Chest',
            url: 'Art/Chest.png',
            frameConfig: {
                frameWidth: 42,
                frameHeight: 29,
                startFrame: 0,
                endFrame: 5
            }
        })

    };


    create() {
        //here i'm manipulating the image
        this.background = this.add.image(355, 355, "bg").setDisplaySize(710, 710);

        this.platforms = this.physics.add.staticGroup();
        //Ground Layers
        this.platforms.create(355, 695, "Ground1").setScale(0.7).refreshBody();
        this.platforms.create(100, 560, "Ground2.1").setScale(0.7).refreshBody();
        this.platforms.create(620, 560, "Ground2.2").setScale(0.7).refreshBody();
        this.platforms.create(355, 420, "Ground3").setScale(0.6).refreshBody();
        this.platforms.create(100, 290, "Ground2.1").setScale(0.7).refreshBody();
        this.platforms.create(620, 290, "Ground2.2").setScale(0.7).refreshBody();
        this.platforms.create(355, 160, "Ground3").setScale(0.6).refreshBody();
        this.platforms.create(355, 15, "Celling").setScale(0.7).refreshBody();

        //Block Layers
        this.platforms.create(368, 610, "Block").setScale(0.7).refreshBody();
        this.platforms.create(60, 470, "Block").setScale(0.7).refreshBody();
        this.platforms.create(650, 470, "Block").setScale(0.7).refreshBody();
        this.platforms.create(60, 215, "Block").setScale(0.7).refreshBody();
        this.platforms.create(650, 215, "Block").setScale(0.7).refreshBody();
        this.platforms.create(368, 340, "Block").setScale(0.7).refreshBody();

        //Wall Layers
        this.platforms.create(15, 315, "LeftWall").setScale(0.7).refreshBody();
        this.platforms.create(695, 315, "RightWall").setScale(0.7).refreshBody();


        //New: Score text
        this.pScore = this.add.text(650, 50, this.player1Score + "/3", {
            font: "35px Arial",
            fill: "#00ff0b"
        });

        //
        this.pTScore = this.add.text(10, 50, this.player2Score + "/3", {
            font: "35px Arial",
            fill: "cyan"
        });

        this.platforms.children.entries.forEach((element) => {
            element.refreshBody();
        });

///////////////////////////////////////////////////////////////////////////MUSIC//////////////////////////////////////////////////////////////////////////////////////////

        this.backM = this.sound.add("bgM");
        //NEW sfx
        this.jump = this.sound.add("jump")
        this.coin = this.sound.add("coin")
        this.win = this.sound.add("win")
        this.boom = this.sound.add("boom")

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

        this.backM.play(musicConfig);

//////////////////////////////////////////////////////////////////////////////Chest////////////////////////////////////////////////////////////////////////////////////////

        this.Chest = this.physics.add.sprite(370, 100, "Chest");

        this.Chest.anims.create({
            key: "IdealChest",
            frames: [{ key: "Chest", frame: 0 }],
            frameRate: 15,
            repeat: -1
        })

        this.Chest.anims.create({
            key: "Chest_Open",
            frames: this.anims.generateFrameNumbers("Chest", { start: 0, end: 5 }),
            frameRate: 5,
        });

        this.physics.add.collider(this.Chest, this.platforms);

//////////////////////////////////////////////////////////////////////////////bombs///////////////////////////////////////////////////////////////////////////////////////

        this.Bombs = this.physics.add.group({
            key: "Bomb",
            repeat: 5,
        });

        this.Bombs.children.iterate((Bomb, index) => {
            switch (index) {
                case 0:
                    Bomb.setPosition(170, 200);
                    break;
                case 1:
                    Bomb.setPosition(550, 200);
                    break;
                case 2:
                    Bomb.setPosition(170, 400);
                    break;
                case 3:
                    Bomb.setPosition(550, 400);
                    break;
                case 4:
                    Bomb.setPosition(300, 350);
                    break;
                case 5:
                    Bomb.setPosition(430, 350);
                    break;
            }
            Bomb.setScale(0.9);
        });

        this.Bombs.children.entries.forEach((element) => {
            element.setBounce(0, 0.75);
        });

        this.physics.add.collider(this.Bombs, this.platforms);

        this.Bombs.children.iterate((Bomb) => {
            Bomb.anims.create({
                key: "IdealBomb",
                frames: this.anims.generateFrameNumbers("Bomb", { start: 0, end: 1 }),
                frameRate: 5,
                repeat: -1
            });
            Bomb.play('IdealBomb');
        });


/////////////////////////////////////////////////////////////////////Green Keys///////////////////////////////////////////////////////////////////////////////////////////

        this.GreenKeys = this.physics.add.group({
            key: "GreenKey",
            repeat: 2,
            //setXY: { x: 100, y: 50, stepX: 10 }
        });

        this.GreenKeys.children.iterate((GreenKey, index) => {
            switch (index) {
                case 0:
                    GreenKey.setPosition(650, 200);
                    break;
                case 1:
                    GreenKey.setPosition(70, 650);
                    break;
                case 2:
                    GreenKey.setPosition(60, 500);
                    break;
            }
            GreenKey.setScale(0.9);
        });

        this.physics.add.collider(this.GreenKeys, this.platforms);



        this.GreenKeys.children.iterate((GreenKey) => {
            GreenKey.anims.create({
                key: "IdealGreenKey",
                frames: this.anims.generateFrameNumbers("GreenKey", { start: 0, end: 23 }),
                frameRate: 10,
                repeat: -1
            });

            GreenKey.play('IdealGreenKey');
        });

////////////////////////////////////////////////////////////////////////////////BlueKey///////////////////////////////////////////////////////////////////////////////////

        this.BlueKeys = this.physics.add.group({
            key: "BlueKey",
            repeat: 2,
        });

        this.BlueKeys.children.iterate((BlueKey, index) => {
            switch (index) {
                case 0:
                    BlueKey.setPosition(60, 250);
                    break;
                case 1:
                    BlueKey.setPosition(630, 600);
                    break;
                case 2:
                    BlueKey.setPosition(650, 500);
                    break;
            }
            BlueKey.setScale(0.9);
        });

        this.physics.add.collider(this.BlueKeys, this.platforms);


        this.BlueKeys.children.iterate((BlueKey) => {
            BlueKey.anims.create({
                key: "IdealBlueKey",
                frames: this.anims.generateFrameNumbers("BlueKey", { start: 0, end: 23 }),
                frameRate: 10,
                repeat: -1
            });

            BlueKey.play('IdealBlueKey');
        });

////////////////////////////////////////////////////////////Player 1 & player 2 //////////////////////////////////////////////////////////////////////////////////


        this.player = this.physics.add.sprite(660, 650, "player");
        this.physics.add.collider(this.player, this.platforms);
        this.player.setCollideWorldBounds(this.player, 1, 0.5);


        //Player2
        this.player2 = this.physics.add.sprite(50, 650, "player2");
        this.physics.add.collider(this.player2, this.platforms);
        this.player2.setCollideWorldBounds(this.player2, 1, 0.5);

        this.physics.add.collider(this.player, this.player2);


        this.physics.add.overlap(this.player, this.GreenKeys, this.onPlayerOverlap, null, this);
        this.physics.add.overlap(this.player2, this.BlueKeys, this.onPlayerOverlap2, null, this);
        this.physics.add.overlap(this.player, this.Bombs, this.onPlayerOverlap3, null, this);
        this.physics.add.overlap(this.player2, this.Bombs, this.onPlayerOverlap4, null, this);
        this.physics.add.overlap(this.player, this.Chest, this.onPlayerOverlap5, null, this);
        this.physics.add.overlap(this.player2, this.Chest, this.onPlayerOverlap6, null, this);


/////////////////////////////////////////////////////////////////////////////Animations///////////////////////////////////////////////////////////////////////////////////


        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 13, end: 2 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", { start: 35, end: 46 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "idle_Right",
            frames: this.anims.generateFrameNumbers("player", { start: 25, end: 35 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "idle_Left",
            frames: this.anims.generateFrameNumbers("player", { start: 24, end: 14 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "jump",
            frames: [{ key: "player", frame: 47 }],
            frameRate: 10,
            repeat: -1
        })

////////////////////////////////////////////////////////////////////////////player2 Animations////////////////////////////////////////////////////////////////////////////

        this.anims.create({
            key: "left2",
            frames: this.anims.generateFrameNumbers("player2", { start: 13, end: 2 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "right2",
            frames: this.anims.generateFrameNumbers("player2", { start: 35, end: 46 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "idle_Right2",
            frames: this.anims.generateFrameNumbers("player2", { start: 25, end: 35 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "idle_Left2",
            frames: this.anims.generateFrameNumbers("player2", { start: 24, end: 14 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "jump2",
            frames: [{ key: "player2", frame: 47 }],
            frameRate: 10,
            repeat: -1
        })

////////////////////////////////////////////////////////////////////////////////////////KeyAnimation////////////////////////////////////////////////////////////////////

        this.userInput = this.input.keyboard.createCursorKeys();
        this.wKey = this.input.keyboard.addKey('W');
        this.aKey = this.input.keyboard.addKey('A');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');

    };

    update() {

        if (this.userInput.right.isDown && this.move == true) {

            this.player.anims.play("right", true);
            this.player.setVelocityX(200);
            this.player1_direction = 1;

        } else if (this.userInput.left.isDown && this.move == true) {

            this.player.anims.play("left", true);
            this.player.setVelocityX(-200);
            this.player1_direction = -1;


        } else {
            if (this.player1_direction == 1) {
                this.player.anims.play("idle_Right", true);
                this.player.setVelocityX(0);
            } else {
                this.player.anims.play("idle_Left", true);
                this.player.setVelocityX(0);
            }


        }

        if (this.userInput.up.isDown && this.player.body.touching.down && this.move == true) {
            this.player.anims.play("jump", true);
            this.player.setVelocityY(-400);

        }

////////////////////////////////////////////////////////////////////////////////////Player 2//////////////////////////////////////////////////////////////////////////////

        if (this.dKey.isDown && this.move == true) {

            this.player2.anims.play("right2", true);
            this.player2.setVelocityX(200);
            this.player2_direction = 1;


        } else if (this.aKey.isDown && this.move == true) {

            this.player2.anims.play("left2", true);
            this.player2.setVelocityX(-200);
            this.player2_direction = -1;


        } else {
            if (this.player2_direction == 1) {
                this.player2.anims.play("idle_Right2", true);
                this.player2.setVelocityX(0);
            } else {
                this.player2.anims.play("idle_Left2", true);
                this.player2.setVelocityX(0);
            }
        }

        if (this.wKey.isDown && this.player2.body.touching.down && this.move == true) {
            this.player2.anims.play("jump2", true);
            this.player2.setVelocityY(-400)
        }
    };

    onPlayerOverlap(player, GreenKey) {
        console.log("hit")
        GreenKey.disableBody(true, true)
        this.score()
    };

    onPlayerOverlap2(Player2, BlueKey) {
        console.log("hit")
        BlueKey.disableBody(true, true)
        this.score2()
    };

    onPlayerOverlap3(player, Bomb) {

        this.boom.play();
        Bomb.disableBody(true, true);
        this.player.setPosition(650, 650).setVelocity(0);
    };

    onPlayerOverlap4(Player2, Bomb) {

        this.boom.play();
        Bomb.disableBody(true, true);
        this.player2.setPosition(50, 650).setVelocity(0);
    };

    onPlayerOverlap5(player, Chest) {
        console.log("hit")
        if (this.player1Score > 2 && this.animationPlayed == false) {
            this.Chest.anims.play("Chest_Open", true);
            this.animationPlayed = true;
            //NEW win sfx plays
            this.win.play();
            this.backM.stop(); //added this
            //NEW bool so player won't move when Win screen appears
            this.move = false
            //NEW wining screen
            this.add.text(260, 455, "Player 1 won!", {
                font: "bold 35px Arial",
                fill: "#00ff0b"
            });
            this.player1Score = 0;
            this.player2Score = 0;
            //NEW wait then switch/restart the scene
            setTimeout(() => this.scene.start("lvl1"), 3000)
            setTimeout(() => this.move = true, 3000) //I think it's not correct to do this but well, needs and all that
            this.animationPlayed = false;

        }


    };

    onPlayerOverlap6(Player2, Chest) {
        console.log("hit")
        if (this.player2Score > 2 && this.animationPlayed == false) {
            this.Chest.anims.play("Chest_Open", true);
            this.animationPlayed = true;
            //NEW win sfx plays
            this.win.play();
            this.backM.stop(); //added this
            //NEW bool so player won't move when Win screen appears
            this.move = false
            //NEW wining screen
            this.add.text(260, 455, "Player 2 won!", {
                font: "bold 35px Arial",
                fill: "cyan"
            });
            this.player2Score = 0;
            this.player1Score = 0;
            //NEW wait then switch/restart the scene
            setTimeout(() => this.scene.start("lvl1"), 3000)
            setTimeout(() => this.move = true, 3000) //I think it's not correct to do this but well, needs and all that
            this.animationPlayed = false;
        }

    };

    score() {
        this.player1Score += 1;
        this.coin.play() //added this
        this.pScore.setText(this.player1Score + "/3")
    }

    score2() {
        this.player2Score += 1;
        this.coin.play() //added this
        this.pTScore.setText(this.player2Score + "/3")
    }

}