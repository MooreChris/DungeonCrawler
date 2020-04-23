// import Phaser from '../libs/phaser.js'
// game variables
// import controlsInfo from "../game/constants.js";

let cursors;
let player;
let slime;
let gameOver = false;
let showDebug = false;

// const game = new Phaser.game(config);

// the main game class
export default class GameScene extends Phaser.Scene {

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
        this.load.spritesheet('Player_01', './img/PLAYER_Sprite1.png',
            { frameWidth: 64, frameHeight: 64 });
        // enemy animation sheets
         this.load.spritesheet('slime','./img/ENEMY_Slime.png',
             { frameWidth: 32, frameHeight: 32 });

         this.load.audio('theme', [
             './music/Horror_Music.mp3'
         ])

    }


    //Called once after preload has finished
    create(game) {

        // play music
        let music = this.sound.add('theme');

        music.play();
        music.setVolume(0.1);

        const map = this.make.tilemap({ key: 'map'});

        // background colour
        // this.backgroundColor = "#87524E";
        this.cameras.main.setBackgroundColor("#260D19");

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
    //    this.player = new Actor(this, map.widthInPixels / 2, map.heightInPixels / 2);

        // make the player collide with things
        //this.physics.add.collider(this.player.sprite, wallLayer);

        //player.originX(0.5);
        //player.originY(0.5);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        const anims = this.anims;
        this.anims.create({
            key: 'playerLeft',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 4, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'moveLeft',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: false
        });

        this.anims.create({
            key: 'leftAttack',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'playerRight',
           frames: this.anims.generateFrameNumbers('Player_01', { start: 8, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'moveRight',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 8, end: 10 }),
            frameRate: 10,
            repeat: false
        });

        this.anims.create({
            key: 'rightAttack',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 11, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'playerDown',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downMove',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: false
        });

        this.anims.create({
            key: 'downAttack',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'playerUp',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 12, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upMove',
            frames: this.anims.generateFrameNumbers('Player_01', { start: 12, end: 14 }),
            frameRate: 10,
            repeat: false
        });

        this.anims.create({
            key: 'upAttack',
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

        // Help text that has a "fixed" position on the screen
        this.add
            .text(550, 16, "Arrow keys to move", {
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

        // the four directions
        const directions = [
            {x: -1, y: 0}, // left
            {x: 1, y: 0}, // right
            {x: 0, y: -1}, // up
            {x: 0, y: 1} // down
        ];

        let playerDirX = 0;
        let playerDirY = 1;

        // Stop any previous movement from the last frame
        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-speed);
            playerDirX = -1; // face left
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(speed);
            playerDirX = 1; // face right
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-speed);
            playerDirY = -1; // face up
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(speed);
            playerDirY = 1; // face down
        }

        //Attack movement
        /*
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
        */

        let playerIsAttacking = false;


        if (cursors.space.isDown){
            playerIsAttacking = true;
        } else {
            playerIsAttacking = false;
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (cursors.left.isDown) {  // LEFT
            player.anims.play("moveLeft", true);
            if (cursors.left.isDown && playerIsAttacking){
                player.anims.play("leftAttack", true);
            }
        }

        else if (cursors.right.isDown) {    // RIGHT
            player.anims.play("moveRight", true);
            if (cursors.right.isDown && playerIsAttacking) {
                player.anims.play("rightAttack", true);
            }
        }

         else if (cursors.up.isDown) {  // UP
             player.anims.play("upMove", true);
             if (cursors.up.isDown && playerIsAttacking) {
                 player.anims.play("upAttack", true);
             }
         }

         else if (cursors.down.isDown) { // DOWN
            player.anims.play("downMove", true);
            if (cursors.down.isDown && playerIsAttacking) {
                player.anims.play("downAttack", true);
            }

            else {
                // unused
                        // player.anims.stop();
            /*
                        // If we were moving, pick an idle frame to use
                     if (prevVelocity.x < 0) player.anims.play("playerLeft", true);
                     if (prevVelocity.x > 0) player.anims.play("playerRight", true);
                     if (prevVelocity.y < 0) player.anims.play("playerUp", true);
                     if (prevVelocity.y > 0) player.anims.play("playerDown", true);

             */
                    }


         }

    }


}

