const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
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

//Loads assets
function preload() {
    this.load.image("tiles", './maps/Tileset01_32x32px.png');
    this.load.tilemapTiledJSON('map', './maps/Map01.json');

}

//Called once after preload has finished
function create() {
    const map = this.make.tilemap({ key: 'map'});

    //calling on map in preload
    const tileset = map.addTilesetImage("Tileset 1", "tiles");

    //Layer name from Tiled, tileset, x, y
    const floorLayer = map.createStaticLayer("FLOOR LAYER", tileset,0, 0);
    const wallLayer = map.createStaticLayer("WALL LAYER", tileset, 0, 0);


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
        .text(16, 16, "Arrow keys to scroll", {
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
