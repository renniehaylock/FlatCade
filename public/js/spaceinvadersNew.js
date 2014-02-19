// STATIC VARIABLES
// ------------------
//width of canvas
var width = 600;
//height of canvas
var height = 500;
var c = document.getElementById('cnv');
var c2 = document.getElementById('cnv2');
var c3 = document.getElementById('cnv3');
var horizSpeed = 3;
var vertSpeed;
var level = 6;
var keyValue = 0;
//two-dimensional graphic context of the
//canvas, the only one supported by all 
//browsers for now
var ctx = c.getContext('2d');
var ctx2 = c2.getContext('2d');
var ctx3 = c3.getContext('2d');
var paused = true;
c.width = width;
c.height = height;
c2.width = width;
c2.height = height;
c3.width = width;
c3.height = height;
// OBJECT Instances
// --------------------

// IMAGE REPOSITORY
// ------------------
var shipImg = new Image();
shipImg.src = 'images/si_ship.png';
var invader1Img = new Image();
invader1Img.src = 'images/si_invader1.png';
var invader2Img = new Image();
invader2Img.src = 'images/si_invader2.png';
var invader3Img = new Image();
invader3Img.src = 'images/si_invader3.png';
var fbulletImg = new Image();
fbulletImg.src = 'images/si_fbullet.png';
var ebullet = new Image();
ebullet.src = 'images/si_ebullet.png';

var game = new Game();
var listOfFBullets = [];
var listOfEBullets = [];
var listofInvaders = [];
var ship = new Ship();

// Fill bkgd with custom pattern
// ------------------------------
    ctx.fillStyle = "#2C3E50";
    ctx.fillRect(0, 0, c.width, c.height); // context.fillRect(x, y, width, height);


// MAIN SETTINGS
// ----------------

// OBJECTS
// -----------
// ---------

// DRAWABLE
// -------------

function Drawable() {
    this.init = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}
// GAME
// ---------------
// end()
// start()
// new()
function Game() {
}

Game.prototype.end = function() {
    document.getElementById('game-over').style.display = "inline";
}

Game.prototype.restart = function() {
    document.getElementById('paused').style.display = "none";
    document.getElementById('instructions').style.display = "none";
    paused = false;
}

Game.prototype.pause = function() {
    document.getElementById('paused').style.display = "inline";
    paused = true;
}

// SHIP
// ----------------
// X pos
// Y pos STATIC
// width STATIC
// height STATIC
// lives
// move()
// kill()
// shoot()

function Ship() {
    this.x = width/2;
    this.y = c.height - 80;
    this.width = 48;
    this.height = 46;
    this.lives = 4;
}

Ship.prototype.move = function() {
    if (keyValue == 39) { // RIGHT ARROW
        this.clear();
        this.x = this.x + horizSpeed;
    }
    if (keyValue == 37) { // LEFT ARROW
        this.clear();
        this.x = this.x - horizSpeed;
    }
    this.render();
}

Ship.prototype.render = function() {
        ctx2.drawImage(shipImg, ship.x, ship.y);
}

Ship.prototype.clear = function() {
    ctx2.clearRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4); // the extra padding is for Safari problem
}

Ship.prototype.kill = function(direction) {
    
}

Ship.prototype.shoot = function() {
    var bullet = new Fbullet(this.x,this.y);
    
}

// FRIENDLY BULLET
// -----------------
// X pos STATIC
// Y pos 
// move()
function Fbullet(x,y) {
    this.x = x;
    this.y = y;
}

Fbullet.prototype.move = function() {
    this.y = this.y - vertSpeed;
}

// ENEMY BULLET
// -----------------
// X pos STATIC
// Y pos
// move()
function Ebullet(x,y) {
    this.x = x;
    this.y = y;
}

Ebullet.prototype.move = function() {
    this.y = this.y + horizSpeed;
}

// List of FBULLET
// -----------------
// A list of friendly bullets

// List of EBULLET
// -----------------
// A list of enemy bullets

// INVADER1
// -------------
// Hits: how many hits before it dies
// X pos
// Y pos STATIC
// isDead: boolean;
// width
// height
// touchedWall: boolean;
// move()
// kill()

function Invader1() {
    this.height = 18;
    this.width = 14;
    this.x = Math.floor(Math.random() * width);
    this.y = 0 - this.height;
    this.hits = 1;
    this.isDead = false;
    this.imgURL = 'images/si_invader1';
}

Invader1.prototype.move = function() {
    this.y = this.y + vertSpeed;
}

Invader1.prototype.isDead = function() {
    return this.isDead;
}

Invader1.prototype.touchedWall = function() {
    if ((this.y + this.height) > c.height) {
        return true;
    }
    else
    {
        return false;
    }
}

// INVADER2
// -------------
// Hits: how many hits before it dies
// X pos
// Y pos STATIC
// isDead: boolean;
// width
// height
// touchedWall: boolean;
// move()
// kill()

function Invader2() {
    this.height = 34;
    this.width = 36;
    this.x = Math.floor(Math.random() * width);
    this.y = 0 - this.height;
    this.hits = 2;
    this.isDead = false;
    this.imgURL = 'images/si_invader2';
}

Invader2.prototype.move = function() {
    this.y = this.y + vertSpeed;
    
}

Invader2.prototype.isDead = function() {
    return this.isDead;
}

Invader2.prototype.gotHit = function(listfbullets) {
    for (i = 0; i < listfbullets.length;i++) {
        if (listfbullets[i].x >= this.x && listfbullets[i].x <= this.x + this.width  
           && listfbullets[i].y >= this.y && listfbullets[i].x <= this.y + this.height) {
            return true;
            this.hits = this.hits - 1;
        }
        else {
            return false;
        }
    }
}

Invader2.prototype.touchedWall = function() {
    if ((this.y + this.height) > c.height) {
        return true;
        this.isDead = true;
    }
    else
    {
        return false;
    }
}

// INVADER3
// -------------
// Hits: how many hits before it dies
// X pos
// Y pos STATIC
// width
// height
// isDead: boolean;
// touchedWall: boolean;
// move()
// kill()

function Invader3() {
    this.height = 79;
    this.width = 81;
    this.x = Math.floor(Math.random() * width);
    this.y = 0 - this.height;
    this.hits = 4;
    this.isDead = false;
    this.imgURL = 'images/si_invader3';
}

Invader3.prototype.move = function() {
    this.y = this.y + vertSpeed;
    
}

Invader3.prototype.isDead = function() {
    return this.isDead;
}

Invader3.prototype.gotHit = function(listfbullets) {
    for (i = 0; i < listfbullets.length;i++) {
        if (listfbullets[i].x >= this.x && listfbullets[i].x <= this.x + this.width  
           && listfbullets[i].y >= this.y && listfbullets[i].x <= this.y + this.height) {
            return true;
            this.hits = this.hits - 1;
        }
        else {
            return false;
        }
    }
}

Invader3.prototype.touchedWall = function() {
    if ((this.y + this.height) > c.height) {
        return true;
        this.isDead = true;
    }
    else
    {
        return false;
    }
}

// List FUNCTIONS
// -------------------
var invaderTouchedWall = function() {
    for (i=0;i < listofInvaders.length; i++) {
        if (listofInvaders[i].touchedWall()) {
            return true;
        }
    }
}


// KEYEVENT LISTENER
// --------------------
addEventListener("keydown", function (e) {
    keyValue = e.keyCode;
    if (e.keyCode == 32 && paused == false) {
        game.pause();
    }
    else if (e.keyCode == 32 && paused == true) {
        game.restart();
    }
    if (e.keyCode == 38) {
        ship.shoot();
    }
}, false);

addEventListener("keyup", function (e) {
    keyValue = 0;
}, false);

// FUNCTIONS TO CREATE INVADERS AND MAKE THEM SHOOT
// ------------------------------------------------
var addInvader = function() {
    var whichInvader = Math.floor(Math.random() * 3) + 1
    if (whichInvader == 1) {
        listofInvaders.push(new Invader1())
    }
    if (whichInvader == 2) {
        listofInvaders.push(new Invader2())
    }
    if (whichInvader == 3) {
        listofInvaders.push(new Invader3())
    }
}

var invaderAdditionRate = function() {
    var additionRate = 200 + (Math.random() * 200); //the addition rate will be from 2 to 4 seconds
    return additionRate;
}

var invaderShootingRate = function() {
    var shootingRate = 200 + (Math.random() * 600); //every invader will shoot every 2 to 8 seconds
    return shootingRate;
}

// UPDATE FUNCTION
// --------------------
// Update function, runs every second or fraction of a second
var update = function() {
    var shootingInterval = setInterval(addInvader,invaderAdditionRate())
    if (ship.lives == 0 || invaderTouchedWall()){
        game.end();
    }
}

// RENDER FUNCTION
// -----------------------

var render = function () {
    
};

// MAIN GAME LOOP
// ----------------------
var main = function () {
    update();
    render();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
  requestAnimFrame(animloop);
   ship.move();
})();