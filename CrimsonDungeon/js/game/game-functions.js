var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight +200,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

// this file handles the functions of the game itself

var game = new Phaser.Game(config);