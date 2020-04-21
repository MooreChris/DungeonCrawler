import Phaser from '../libs/phaser.js'


// const width = window.innerWidth < 1300 ? 1325: window.innerWidth;
// const height = window.innerHeight;
// set container height
// document.querySelector("#canvas-container").style.height = height+'px';

// const gameScene = new Phaser.Game(config);
// game variables
let cursors;
let player;
let slime;
let gameOver = false;
let showDebug = false;

// the main game class
class GameScene extends Phaser.scene {

    constructor() {
        super({ key: 'GameScene'});
    }

    //Loads assets
     preload() {
        // tileset for maps
        this.load.image("tiles", './maps/Tileset01_32x32px.png');
        // maps / rooms
        this.load.tilemapTiledJSON('map', './maps/Map01.json');

        // player animation sheets
        this.load.spritesheet('Player_01', './img/Player_01.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('Player_Up', './img/player_up.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Player_Down', './img/player_down.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Player_Right', './img/player_right.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Player_Left', './img/player_left.png',
            { frameWidth: 32, frameHeight: 32 });
        // enemy animation sheets
         this.load.spritesheet('slime','./img/ENEMY_Slime.png',
             { frameWidth: 32, frameHeight: 32 });

    }



    //Called once after preload has finished
    create(game) {
        const map = this.make.tilemap({ key: 'map'});

        //calling on map in preload
        const tileset = map.addTilesetImage("Tileset 1", "tiles");

        //Layer name from Tiled, tileset, x, y
        const floorLayer = map.createStaticLayer("FLOOR LAYER", tileset,0, 0);
        const wallLayer = map.createStaticLayer("WALL LAYER", tileset, 0, 0);

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
            //.setDisplaySize(96,96);

        // Watch the player and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(player, wallLayer);

        const camera = this.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        cursors = this.input.keyboard.createCursorKeys();



            // adds a new player to the gameScene
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

        // generic 4 frame idle animation for a slime

        this.anims.create({
            key: 'idleGeneric',
            frames: this.anims.generateFrameNames('slime',{start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        // four idle directional poses

        this.anims.create({
            key: 'playerIdleUp',
            frames: this.anims.generateFrameNames('player_up'),
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({
            key: 'playerIdleDown',
            frames: this.anims.generateFrameNames('player_down'),
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({
            key: 'playerIdleLeft',
            frames: this.anims.generateFrameNames('player_left'),
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({
            key: 'playerIdleRight',
            frames: this.anims.generateFrameNames('player_right'),
            frameRate: 1,
            repeat: -1
        })

        // Help text that has a "fixed" position on the screen
        this.add
            .text(550, 16, "Arrow keys to scroll", {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);

        // enemy index, gameScene reference, x, y
        const EnemySpawn1 = map.findObject("Objects", obj => obj.name === "EnemySpawn1");

        let slime1 = this.physics.add
            .sprite(EnemySpawn1.x,EnemySpawn1.y,'slime')
            .setSize(24,24,32,32)
            .setOffset(4,4);

        // idle animation for the slime
    //    let slimeIdleAnim = slime.animation.add('idle');
    //    slime1.animation.play('slimeIdleAnim', 30, true);

        slime1.play('idleGeneric');

    }




    update(time, delta) {
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
                        // player.anims.stop();

                        // If we were moving, pick an idle frame to use
     //                if (prevVelocity.x < 0) player.anims.play("playerIdleLeft", true);
     //                if (prevVelocity.x > 0) player.anims.play("playerIdleRight", true);
     //                if (prevVelocity.y < 0) player.anims.play("playerIdleUp", true);
     //                if (prevVelocity.y > 0) player.anims.play("playerIdleDown", true);
                    }
                }
    }
}

