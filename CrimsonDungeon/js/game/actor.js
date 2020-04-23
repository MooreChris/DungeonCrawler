// import Phaser from "../libs/phaser.min.js";

const speed = 175; // player speed

const attackSpeed = 500; // speed of the player attack
const attackDuration = 150;
const staggerDuration = 200; // duration of player stagger state (hitstun)
const staggerSpeed = 100; // speed of the player during hitstun

const attackCooldown = attackDuration * 2; // minimum time between attacks

let ACTORS = 25; // maximum number of entities in a single instance of the game world

// a list of all actors, i0 is the player
let player,
    actorList,
    playerHUD;

// points to each actor in its position, for quick searching
let actorMap;

/*
let Keys; {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
}
*/

// function generateMap (){    }

// this function is special as it has no name and can be called immediately
function actorCode() {
    // console.log("actor.js was loaded and function started");

    Actor.prototype.setXY = function (x, y){
        this.x = x;
        this.y = y;

        this.game.add.tween(this.sprite).to(
            {
                x: x * 32,
                y: y * 32
            },
            150,
            Phaser.Easing.Linear.None,
            true
        )
    }

    Player.prototype = new Actor();

    Enemy.prototype = new Actor();

    function Actor (game, x, y, mySprite){
        this.hp = 3;
        this.isPlayer = null;
        this.x = x;
        this.y = y;
        this.damage = 0;

        if (game){
            this.game = game;
            this.sprite = game.add.sprite(x*32,y*32, mySprite);
        } else {
            this.game = null;
            this.sprite = null;
        }
    }

    function Player (game, x, y){
        Actor.call(this, game, x, y, "Player");
        this.hp = 30;
        this.isPlayer = true;
        this.damage = 0; // redundant but just in case
    }

    function Enemy (game, x, y){
        Actor.call(this, game, x, y, "Enemy")
        this.hp = 5;
        this.isPlayer = false;
        this.damage = 0; // redundant but just in case
    }

    // controls the AI of the game, including enemy movement and player death
    function aiController (actor){
        const directions = [
            {x: -1, y: 0}, // left
            {x: 1, y: 0}, // right
            {x: 0, y: -1}, // up
            {x: 0, y: 1} // down
        ];

        let dx = player.x - actor.x,
            dy = player.y - actor.y;

        /*
        let moveToRandomPos = function () {
            let rndDirections = shuffleArray(directions);
            for (var i = 0; i < rndDirections.length; i++) {
                if (moveTo(actor, rndDirections[i])) {
                    break;
                }
            }
        };
         */

        if (player.hp < 1) {
            // game over message
            let gameOver = game.add.text(0, 0, 'Game Over!', {fill: '#e22', align: 'center'});
            gameOver.fixedToCamera = true;
            gameOver.cameraOffset.setTo(500, 500);
        }
    }

    function movement (actor, dir) {

    }



};

