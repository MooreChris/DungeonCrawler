// import Phaser from '../libs/phaser.js';

import GameScene from "../scenes/game-scene.js";

new Phaser.Game({
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    render: { pixelArt: true },
    physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.RESIZE
    }
});