// import Phaser from '../libs/phaser';
import GameScene from '../scenes/game-scene.js';

// const height = 600; // height of gameScene window

// this file starts the actual game

// game configuration
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

let gameScene = new Phaser.Game(config);