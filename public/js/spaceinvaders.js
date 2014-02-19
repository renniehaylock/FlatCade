// STATIC VARIABLES
// ------------------
var width = 600; //width of canvas
var height = 500; //height of canvas
var c = document.getElementById('cnv'); // this canvas holds the background
var c2 = document.getElementById('cnv2'); // this canvas holds the ship
var c3 = document.getElementById('cnv3'); // this canvas holds the bullets and invaders
var horizSpeed = 5;
var vertSpeed = 10;
var bulletSpeed = 10;
var level;
var shipKeyValue = 0;
var bulletKeyValue = 0;
var bulletsLeft = 200;
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

// SET LEVEL FROM URL
// ------------------

var setLevel = function() {
    var url = location.href;
    level = url.substring(url.indexOf("&") + 1,url.length);
}
setLevel();


var getLevelName = function(i) {
        if (i == 1) {
           return 'Novice'
        }
        if (i == 2) {
           return 'Average'
        }
        if (i == 3) {
           return 'Experienced'
        }
        if (i == 4) {
           return 'Skilled'
        }
        if (i == 5) {
           return 'Masterful'
        }

        if (i == 6) {
           return 'Godlike '
        }
}

// Fill bkgd with custom pattern
// ------------------------------
var bgPattern = new Image();
bgPattern.src = 'images/si_bkgd.png';
bgPattern.onload = function() {
    var pat = ctx.createPattern(bgPattern,"repeat");
    ctx.rect(0,0,c.width,c.height);
    ctx.fillStyle=pat;
    ctx.fill();
}

// IMAGES
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

// SHIP
// ----------------

function Ship() {
        this.x = width/2;
        this.y = c.height - 80;
        this.width = 35;
        this.height = 25;
        this.lives = 4;
    this.move = function() {
        if (shipKeyValue == 39 && this.x < (c.width - this.width)) { // RIGHT ARROW
            this.clear();
            this.x = this.x + horizSpeed;
        }
        if (shipKeyValue == 37 && this.x > 0 ) { // LEFT ARROW
            this.clear();
            this.x = this.x - horizSpeed;
        }
        this.render();
    }
    this.render = function() {
        ctx2.drawImage(shipImg, this.x, this.y);
    }
    this.clear = function() {
        ctx2.clearRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4); // the extra padding is for Safari problem
    }
    this.kill = function() {
    }
    this.shoot = function() {
        if (bulletKeyValue == 1) {
            game.bullets.push(new Bullet(this.x + (this.width/2), this.y - 8, "up"));
            bulletsLeft = bulletsLeft - 1;
        }
    }
}

// POINTS
// -----------------------------
function Points() {
    this.pts = 0;
    this.addPts = function(invaderType) {
        if (invaderType == 1){
            this.pts = this.pts + 10;
        } else if (invaderType == 2){
            this.pts = this.pts + 30;
        } else if (invaderType == 3){
            this.pts = this.pts + 50;
        }
    } 
}

// BULLET
// ----------------------

function Bullet(x,y,dir) {
    this.x = x;
    this.y = y;
    this.height = 5;
    this.width = 5;
    this.dir = dir;
    this.move = function() {
        if (this.dir == "up") {
            this.clear();
            this.y = this.y - bulletSpeed;
        }
        else if (this.dir == "down") {
            this.clear();
            this.y = this.y + bulletSpeed;
        }
    }
    this.render = function() {
        if (this.dir == "up") {
            ctx2.drawImage(fbulletImg, this.x, this.y);
        }
        else if (this.dir == "down") {
            ctx3.drawImage(ebulletImg, this.x, this.y);
        }
    }
    this.clear = function() {
        if (this.dir == "up") {
            ctx2.clearRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }   else if (this.dir == "down") {
            ctx3.clearRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }
    }
}

// INVADER
// ------------------------

function Invader(x,y,type,lives) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.lives = lives;
    this.getHeight = function(){
        if (this.type == 1) {
            return 20;
        } else if (this.type == 2) {
            return 20;
        } else if (this.type == 3) {
            return 40;
        }
    }
    this.getWidth = function(){
        if (this.type == 1) {
            return 25;
        } else if (this.type == 2) {
            return 35;
        } else if (this.type == 3) {
            return 55;
        }
    }
    this.render = function() {
        if (this.type == 1) {
            ctx3.drawImage(invader1Img, this.x, this.y);
        } else if (this.type == 2) {
            ctx3.drawImage(invader2Img, this.x, this.y);
        } else if (this.type == 3) {
            ctx3.drawImage(invader3Img, this.x, this.y);
        }
    }
    this.move = function() {
        this.clear();
        this.y = this.y + vertSpeed;
    }
    this.clear = function() {
        ctx3.clearRect(this.x - 2, this.y - 2, this.getWidth() + 4, this.getHeight() + 4);
    }
    this.shoot = function() {
    }
    
    this.isHit = function() {
        for (b = 0; b < game.bullets.length;b++) {
            var bulletX = game.bullets[b].x;
            var bulletY = game.bullets[b].y;
            if (this.x < bulletX && (this.x + this.getWidth()) > bulletX
               && this.y < bulletY && (this.y + this.getHeight()) > bulletY){
                game.points.addPts(this.type);
                game.bullets[b].clear();
                game.bullets.splice(b,1);
                return true;
            }
        }
    }
    
}

// GAME - INITIATES ALL NEW OBJECTS
// --------------------------------

function Game() {
    this.ship = new Ship();
    this.points = new Points();
    this.bullets = [];
    this.invaders = [];
    this.pause = function() {
        clearInterval(interval1);
        clearInterval(interval2);
        document.getElementById('paused').style.display = "inline";
        paused = true;
    }
    this.restart = function() {
        clearInterval(interval1);
        clearInterval(interval2);
        interval1 = setInterval(moveInvaders,2000/level);
        interval2 = setInterval(function(){game.ship.shoot()},100);
        document.getElementById('paused').style.display = "none";
        document.getElementById('instructions').style.display = "none";
        paused = false;
    }
    this.moveBullets = function() {
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].move();
            this.bullets[i].render();
            if (this.bullets[i].y < 0 || this.bullets[i].y > c.height) {
                this.bullets[i].clear();
                this.bullets.shift(this.bullets[i]); // delete bullet from list if out of canvas
            }
        }
    }
    this.gameOver = function() {
        document.getElementById('game-over').style.display = "inline";
    }
    this.gameWin = function() {
        document.getElementById('you-win').style.display = "inline";
    }
    this.checkInvaders = function() {  // checks if any invaders have been hit, if any invaders have reached the wall, or if all invaders have been destroyed
        if (this.invaders.length == 0){
            this.gameWin();
        }
        for (var i = 0; i < this.invaders.length; i++) {
            this.invaders[i].render();
            if ((this.invaders[i].y + this.invaders[i].getHeight()) > c.height) {
                this.gameOver(); // invader reached wall
            }
            if (this.invaders[i].isHit()) {
                this.invaders[i].lives = this.invaders[i].lives - 1;
                if (this.invaders[i].lives == 0) {
                    this.invaders[i].clear();
                    this.invaders.splice(i,1);
                }
            }
        }
    }
    this.checkBulletsLeft = function() {
        if (bulletsLeft == 0) {
            this.gameOver();
        }
    }
    
}

// KEYEVENT LISTENER
// --------------------
addEventListener("keydown", function (e) {
    if (e.keyCode == 39 || e.keyCode == 37) {
        shipKeyValue = e.keyCode;
    }
}, false);

addEventListener("keypress", function (e) {
    if (e.keyCode == 112 && paused == false) {
        game.pause();
    }
    else if (e.keyCode == 112 && paused == true) {
        game.restart();
    }
    
    if (e.keyCode == 32) {
        bulletKeyValue = 1;
    }
}, false);

addEventListener("keyup", function (e) {
    if ((e.keyCode == 39 && shipKeyValue != 37)) {
        shipKeyValue = 0;
    } else if (e.keyCode == 37 && shipKeyValue != 39){
        shipKeyValue = 0;
    }
    else if (e.keyCode == 32) {
        bulletKeyValue = 0;
    }
}, false);

// UPDATE HTML
// --------------
// Updates the points and level divs and the dropdown
var updateHTML = function(level) {
    document.getElementById("points").innerHTML = points + " pts";
    // Add level dropdown
    var levelHtml = "";
    for (i = 1; i < 7; i++) {
           levelHtml = levelHtml + '<li><a href="game.html?spaceinvaders&' + i + '">' +  getLevelName(i) + '</a></li>';
    }

    var dropdownHtml1 = '<button class="btn btn-inverse dropdown-toggle current-level" data-toggle="dropdown">'+ getLevelName(level) + '<span class="caret"></span></button><span class="dropdown-arrow"></span><ul class="dropdown-menu dropdown-item">';

    document.getElementById("dropdown").innerHTML = dropdownHtml1 + levelHtml + '</u>';
    document.getElementById("game-over-dropdown").innerHTML = levelHtml;
    document.getElementById("you-win-dropdown").innerHTML = levelHtml;
    document.getElementById("main-instructions").innerHTML = "press P to start or pause";
    document.getElementById("small-instructions").innerHTML = "move with &nbsp; &#8592 &nbsp; &#8594; &nbsp; , shoot with spacebar";
    document.getElementById("game-info").innerHTML =  "<i id='bullets-left'>" + bulletsLeft + "</i>" + " shots " + "<img src='images/si_fbullet_inst.png'><br>" + "10 pts " + "<img src='images/si_invader1_inst.png'><br>" + "30 pts " + "<img src='images/si_invader2_inst.png'><br>" + "50 pts " + "<img src='images/si_invader3_inst.png'>";
}
var updatePoints = function(points) {
    document.getElementById("points").innerHTML = points + " pts";
}
var updateBullets = function() {
    document.getElementById("bullets-left").innerHTML = bulletsLeft;
}


// GAME LOOP 
// -------------------
var game = new Game();

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
    if (!paused) {
       game.ship.move();
       game.moveBullets();
       game.checkInvaders();
       updatePoints(game.points.pts);
       updateBullets();
       game.checkBulletsLeft();
    }
})();

// FUNCTION TO ADD INVADERS AND MOVE INVADERS
// ------------------------

var addInvaders = function() {
    // For every column
    var topPadding = 50;
    var leftPadding = 75;
    for (b = 0; b < 3; b++) {
        for (col = 0; col < 3; col++) {
            // if its the third column
            if (col == 0) {
                for (row = 0; row < level; row++) {
                    game.invaders.push(new Invader(leftPadding + (col * 40) + (b * 160),topPadding + (row * 35),1,1));
                }
            } else if (col == 1){
                for (row = 0; row < level ; row++) {
                    game.invaders.push(new Invader(leftPadding + (col * 40) + (b * 160),topPadding + (row * 35),2,2));
                }
            } else {
                for (row = 0; row < level - 1; row++) {
                    game.invaders.push(new Invader(leftPadding + (col * 45) + (b * 160),topPadding + (row * 50),3,3));
                }
            }
        }
    }
}

var moveInvaders = function() {
    if (!paused) {
        for (var i = 0; i < game.invaders.length; i++) {
            game.invaders[i].move();
        }
    }
}

// Calls move invaders every few seconds depending on the level played

var interval1 = setInterval(moveInvaders,2000/level);
var interval2 = setInterval(function(){game.ship.shoot()},100);
addInvaders();
updateHTML(level);
updatePoints(game.points.pts);
updateBullets();