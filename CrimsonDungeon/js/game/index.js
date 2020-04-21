import Phaser from '../libs/phaser.js';
import GameScene from '../scenes/game-scene';

const height = 600; // height of gameScene window

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    roundPixels: false,
    width: 800,
    height: 600,
    parent: "gameScene-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    /*
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    */
    scene: [GameScene]
    // autoRound: false
};

const game = new Phaser.game(config);