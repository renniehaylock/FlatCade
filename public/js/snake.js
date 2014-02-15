// MAIN SETTINGS
// -------------------------------
//width of canvas
var width = 600;
//height of canvas
var height = 500;
var c = document.getElementById('snake-cnv');
var speed = 10;
var size = 10;
var ptsPerFood = 10;
var level = 6;
//two-dimensional graphic context of the
//canvas, the only one supported by all 
//browsers for now
var ctx = c.getContext('2d');
var paused = true;
c.width = width;
c.height = height;
ctx.fillStyle = "#111111";
ctx.lineWidth = 2;
ctx.fillRect(0, 0, c.width, c.height);

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
           return 'Adept'
        }
        if (i == 6) {
           return 'Masterful'
        }
        if (i == 7) {
           return 'Inhuman'
        }
        if (i == 8) {
           return 'Godlike '
        }
}



// OBJECTS & DEFINITIONS
// ----------------------------------------
// Game
// -----------
function Game() {
    this.isOver = false;
}

Game.prototype.end = function(){
    //newGame();
    clearInterval(snakeInterval);
    document.getElementById('game-over').style.display = "inline";
}

Game.prototype.pause = function(){
    clearInterval(snakeInterval);
    document.getElementById('paused').style.display = "inline";
    paused = true;
}

Game.prototype.restart = function(){
    clearInterval(snakeInterval);
    snakeInterval = setInterval(main, 100/level);
    document.getElementById('paused').style.display = "none";
    document.getElementById('instructions').style.display = "none";
    paused = false;
}

var newGame = function () {
    clearInterval(snakeInterval);
    //snakeInterval = setInterval(main, 50); // Execute as fast as possible
    ctx.fillRect(0, 0, c.width, c.height);
    head.setX(100);
    head.setY(100);
    head.changeDir("right");
    food.setX(size * (Math.floor(Math.random()* width/size)));
    food.setY(size * (Math.floor(Math.random()* height/size)));
    body = [];
    for (var i=1;i<20;i++){
        body.push(new BodyPart(head.x - (i*size),head.y));
    };
    points.reset();
    updateHTML(points.pts, level);
}

// Snake
// --------------
// a body part is a square with width and height 'size' and x and y position

function BodyPart(x,y) {
    this.x = x;
    this.y = y;
    this.size = size;
};

function Head(x,y,dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
}
        
Head.prototype.moveTick = function(direction){
    // changes direction if key was detected
    if (keypressed == "left") {
        this.changeDir('left');
        keypressed == "";
    }
    if (keypressed == "right") {
        this.changeDir('right');
        keypressed == "";
    }
    if (keypressed == "up") {
        this.changeDir('up');
        keypressed == "";
    }
    if (keypressed == "down") {
        this.changeDir('down');
        keypressed == "";
    }
    // moves the head
    if (direction == "down"){
        this.y = this.y + speed;
    }
    if (direction == "up"){
        this.y = this.y - speed;
    }
    if (direction == "right"){
        this.x = this.x + speed;
    }
    if (direction == "left"){
        this.x = this.x - speed;
    }

}

Head.prototype.getLastX = function(direction){
    if (direction == "down"){
        return this.x;
    }
    if (direction == "up"){
        return this.x;
    }
    if (direction == "right"){
        return this.x - size;
    }
    if (direction == "left"){
        return this.x + size;
    }
}
    
Head.prototype.getLastY = function(direction){
    if (direction == "down"){
        return this.y - size;
    }
    if (direction == "up"){
        return this.y + size;
    }
    if (direction == "right"){
        return this.y;
    }
    if (direction == "left"){
        return this.y;
    }
}
// Figure out a way to set the direction and move it immediately... 
var keypressed;
Head.prototype.setDir = function(keycode) {
    if (keycode == 37 && this.dir != "right") {
        keypressed = "left";
    }
    if (keycode == 38 && this.dir != "down") {
        keypressed = "up";
    }
    if (keycode == 39 && this.dir != "left") {
        keypressed = "right";
    }
    if (keycode == 40 && this.dir != "up") {
        keypressed = "down";
    }
}
Head.prototype.changeDir = function(direction) {
    this.dir = direction;
}
Head.prototype.touchedWall = function() {
    if (this.x >= c.width || this.x < 0 
        || this.y < 0 || this.y >= c.height) {
        return true;
    }
}

Head.prototype.touchedBody = function() {
    for (var i = 0; i < body.length; i++) {
        if (this.x == body[i].x && this.y == body[i].y) {
            return true;
        }
    }
}
Head.prototype.setX = function(x) {
    this.x = x
}
Head.prototype.setY = function(y) {
    this.y = y
}
//body is a list of bodyPart
var body = [];

// Food
// ----------------
function Food(x, y) {
    this.x = x;
    this.y = y;
}
        
Food.prototype.isConsumed = function(headx, heady){
    if (headx == this.x && this.y == heady) {
        return true;
    }
}
Food.prototype.resetFood = function(){  
    this.x = size * (Math.floor(Math.random()* width/size)) ;
    this.y = size * (Math.floor(Math.random()* height/size));
}

Food.prototype.setX = function(x){
    this.x = x;
}
Food.prototype.setY = function(y){
    this.y = y;
}

// Points
// ---------------
function Points(pts) {
    this.pts = pts;
}
Points.prototype.add = function(){
    this.pts = this.pts + ptsPerFood;
}

Points.prototype.reset = function(){
    this.pts = 0;
}

// KEYBOARD CONTROL
// --------------------
// Handle keyboard controls
addEventListener("keydown", function (e) {
    head.setDir(e.keyCode);
    if (e.keyCode == 32 && paused == false) {
        game.pause();
    }
    else if (e.keyCode == 32 && paused == true) {
        game.restart();
    }
}, false);

// APPLICATION
// --------------------
// Instantiating new objects
var game = new Game();
var head = new Head(300,300,"right");
for (var i=1;i<20;i++){
    body.push(new BodyPart(head.x - (i*size),head.y));
};
var points = new Points(0);
var xPosFood = size * (Math.floor(Math.random()* width/size)) ;
var yPosFood = size * (Math.floor(Math.random()* height/size));
var food = new Food(xPosFood, yPosFood);

// UPDATE FUNCTION
// ------------------------
// Update function, runs every second or fraction of a second
var update = function() {
    //updates location of snake
    if (food.isConsumed(head.x, head.y)) {
        food.resetFood();
        points.add();
        updateHTML(points.pts, level);
        var lastBodyX = body[body.length - 1].x;
        var lastBodyY = body[body.length - 1].y;
        body.push(new BodyPart(head.x,head.y))
    }
    body.pop();
    body.unshift(new BodyPart(head.x,head.y));
    head.moveTick(head.dir);
    // Check if head  caught food
    if (head.touchedWall() || head.touchedBody()){
        game.end();
    }
    //TODO !! Code to check if head touched wall or body
}
//TODO: make sure the snake cannot go to the direction opposite to current.

// RENDER STUFF
// ----------------

// Draw everything
var render = function () {
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    //Draw food
    var snakeFood = new Image();
    snakeFood.src = 'images/snake-food.png';
    snakeFood.onload = function() {
        ctx.drawImage(snakeFood, food.x, food.y);
    }    
    //Clear last rectangle
    //Draw new rectangle for head
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(head.x, head.y, size,size);
    // Draw the body of the snake
    bodyLength = body.length;
    for (var i=0; i < bodyLength;i++) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(body[i].x, body[i].y, size,size);
    }
    //Clear the last item in the body of the snake
    ctx.fillStyle = "#16A085";
    ctx.fillRect(body[bodyLength - 1].x, body[bodyLength - 1].y, size,size);
};
    
//MAIN GAME LOOP
// The main game loop
var main = function () {
    update();
    render();
};

// HELPERS
// -------------------
// Updates the points and level divs and the dropdown
var updateHTML = function(points, level) {
    document.getElementById("points").innerHTML = points + " pts";
    // Add level dropdown
    var levelHtml = "";
    for (i = 1; i < 9; i++) {
           levelHtml = levelHtml + '<li><a href="game.html?snake&' + i + '">' +  getLevelName(i) + '</a></li>';
    }

    var dropdownHtml1 = '<button class="btn btn-primary dropdown-toggle current-level" data-toggle="dropdown">'+ getLevelName(level) + '<span class="caret"></span></button><span class="dropdown-arrow dropdown-arrow-inverse"></span><ul class="dropdown-menu dropdown-inverse dropdown-item">';

    document.getElementById("dropdown").innerHTML = dropdownHtml1 + levelHtml + '</u>';
    document.getElementById("game-over-dropdown").innerHTML = levelHtml;
}

// START GAME!
clearInterval(snakeInterval);
var snakeInterval; // Execute as fast as possible
updateHTML(points.pts, level);
