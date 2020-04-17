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


//Loads assets
function preload() {
    this.load.image("tiles", './maps/Tileset01_32x32px.png');
    this.load.tilemapTiledJSON ('map', './maps/TEST_MAP.json');

}

//Called once after preload has finished
function create() {
    const map = this.make.tilemap({ key: 'map'});

    //calling on map in preload
    const tiles = map.addTilesetImage("Tileset 1", "tiles");

    //Layer name from Tiled, tileset, x, y
    const wallLayer = map.createStaticLayer('Wall', 0, 0);
    const floorLayer = map.createStaticLayer('Floor', 0, 0);

    this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);




}

function update(time, delta){
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}
