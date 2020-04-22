// import Phaser from "../libs/phaser.min.js";

const speed = 175; // player speed

const attackSpeed = 500; // speed of the player attack
const attackDuration = 150;
const staggerDuration = 200; // duration of player stagger state (hitstun)
const staggerSpeed = 100; // speed of the player during hitstun

const attackCooldown = attackDuration * 2; // minimum time between attacks

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

function generateMap (){

}

(function () { // this function is special as it has no name and can be called immediately


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

    Actor (game, x, y, mySprite){
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

    Player (game, x, y){
        Actor.call(this, game, x, y, "Player");
        this.hp = 30;
        this.isPlayer = true;
        this.damage = 0; // redundant but just in case
    }

    Enemy (game, x, y){
        Actor.call(this, game, x, y, "Enemy")
        this.hp = 5;
        this.isPlayer = false;
        this.damage = 0; // redundant but just in case
    }

} ());

