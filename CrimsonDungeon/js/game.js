const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    autoRound: false
};

const game = new Phaser.Game(config);
let controls;
let player;

//Loads assets
function preload() {
    this.load.image("tiles", './maps/Tileset01_32x32px.png');
    this.load.tilemapTiledJSON('map', './maps/Map01.json');
    this.load.spritesheet('Player_01', './img/Player_01.png',
        { frameWidth: 64, frameHeight: 64 });

}

//Called once after preload has finished
function create() {
    const map = this.make.tilemap({ key: 'map'});

    //calling on map in preload
    const tileset = map.addTilesetImage("Tileset 1", "tiles");

    //Layer name from Tiled, tileset, x, y
    const floorLayer = map.createStaticLayer("FLOOR LAYER", tileset,0, 0);
    const wallLayer = map.createStaticLayer("WALL LAYER", tileset, 0, 0);

    wallLayer.setCollisionByProperty({ collides: true });

    player = this.physics.add.sprite(100, 450, 'Player_01');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'Player_01', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'Player_01',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });



// Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Set up the arrows to control the camera
    const cursors = this.input.keyboard.createCursorKeys();
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    });

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
        .text(550, 16, "Arrow keys to scroll", {
            font: "18px monospace",
            fill: "#ffffff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000000"
        })
        .setScrollFactor(0);
}

function update(time, delta){
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();


}
