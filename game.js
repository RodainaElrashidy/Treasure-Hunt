var config = {
    type: Phaser.AUTO,
    width: 710,
    height: 710, //-100 is a rand num i just wanted there to be space between the canvas and the borders
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [Scene1, Scene2],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 1000 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);