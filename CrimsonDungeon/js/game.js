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
        .sprite(PlayerSpawn.x, PlayerSpawn.y, "Player_01")
        .setSize(24, 24, 32, 32)
        .setOffset(20, 24);

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(player, wallLayer);

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

    const anims = this.anims;
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'leftSpace',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 7, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
       frames: this.anims.generateFrameNumbers('Player_01', { start: 8, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'rightSpace',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 11, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
       frames: this.anims.generateFrameNumbers('Player_01', { start: 0, end: 2 }),
       frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'downSpace',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 3, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 12, end: 14 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'upSpace',
        frames: this.anims.generateFrameNumbers('Player_01', { start: 15, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

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

    //Attack movement
    if (cursors.left.isDown && cursors.space.isDown) {
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown && cursors.space.isDown) {
        player.body.setVelocityX(speed);
    }

    if (cursors.up.isDown && cursors.space.isDown) {
        player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown && cursors.space.isDown) {
        player.body.setVelocityY(speed);
    }


    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
        player.anims.play("left", true);
        if (cursors.left.isDown && cursors.space.isDown){
            player.anims.play("leftSpace", true);
        }
    }

    else if (cursors.right.isDown) {
        player.anims.play("right", true);
        if (cursors.right.isDown && cursors.space.isDown) {
            player.anims.play("rightSpace", true);
        }
    }

     else if (cursors.up.isDown) {
         player.anims.play("up", true);
         if (cursors.up.isDown && cursors.space.isDown) {
             player.anims.play("upSpace", true);
         }
     }

     else if (cursors.down.isDown) {
        player.anims.play("down", true);
             if (cursors.down.isDown && cursors.space.isDown) {
                    player.anims.play("downSpace", true);
                }
        else {
                    player.anims.stop();

                    // If we were moving, pick and idle frame to use
                    if (prevVelocity.x < 0) player.setTexture("Player_01", "left");
                    if (prevVelocity.x > 0) player.setTexture("Player_01", "right");
                    if (prevVelocity.y < 0) player.setTexture("Player_01", "up");
                    if (prevVelocity.y > 0) player.setTexture("Player_01", "down");
                }
            }
}
