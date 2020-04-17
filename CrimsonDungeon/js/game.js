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
let cursors;
let player;
let showDebug = false;

//Loads assets
function preload() {
    this.load.image("tiles", './maps/Tileset01_32x32px.png');
    // TEMPORARY ATLAS
    this.load.tilemapTiledJSON('map', './maps/Map01.json');
    this.load.atlas("atlas", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json");
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

    // player = this.physics.add.sprite(200, 200, 'Player_01');

    // make the player collide with the walls on wall layer
    wallLayer.setCollisionByProperty({ collides: true });

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    //this.physics.add.collider(player, wallLayer);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const PlayerSpawn = map.findObject("Objects", obj => obj.name === "PlayerSpawn");

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    player = this.physics.add
        .sprite(PlayerSpawn.x, PlayerSpawn.y, "atlas", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 24);

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(player, wallLayer);

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = this.anims;
    anims.create({
        key: "misa-left-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-right-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-front-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-back-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });

    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    cursors = this.input.keyboard.createCursorKeys();



        // adds a new player to the game
//    this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels / 2);

    // make the player collide with things
    //this.physics.add.collider(this.player.sprite, wallLayer);

    //player.originX(0.5);
    //player.originY(0.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //this.anims.create({
    //    key: 'left',
    //    frames: this.anims.generateFrameNumbers('Player_01', { start: 0, end: 3 }),
    //    frameRate: 10,
    //    repeat: -1
    //});

    //this.anims.create({
    //    key: 'turn',
    //    frames: [ { key: 'Player_01', frame: 4 } ],
    //    frameRate: 20
    //});

    //this.anims.create({
    //    key: 'Player_01',
    //    frames: this.anims.generateFrameNumbers('Player_01', { start: 5, end: 8 }),
    //    frameRate: 10,
    //    repeat: -1
    //});

    // Debug graphics
    this.input.keyboard.once("keydown_D", event => {
        // Turn on physics debugging to show player's hitbox
        this.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = this.add
            .graphics()
            .setAlpha(0.75)
            .setDepth(20);
        wallLayer.renderDebug(graphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
    });

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


function update(time, delta) {
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
        player.anims.play("misa-left-walk", true);
    } else if (cursors.right.isDown) {
        player.anims.play("misa-right-walk", true);
    } else if (cursors.up.isDown) {
        player.anims.play("misa-back-walk", true);
    } else if (cursors.down.isDown) {
        player.anims.play("misa-front-walk", true);
    } else {
        player.anims.stop();

        // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
        else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
        else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
        else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
    }
}
