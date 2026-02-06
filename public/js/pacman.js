// MAIN SETTINGS
// -------------------------------
var width = 600;
var height = 500;
var c = document.getElementById('cnv');
var c2 = document.getElementById('cnv2');
var c3 = document.getElementById('cnv3');
var ctx = c.getContext('2d');
var ctx2 = c2.getContext('2d');
var ctx3 = c3.getContext('2d');
var paused = true;
var level;
var cellSize = 20;
var cols = 30;
var rows = 25;
c.width = width;
c.height = height;
c2.width = width;
c2.height = height;
c3.width = width;
c3.height = height;

// COLORS
// ------------------
var COLOR_BG = '#1a1a2e';
var COLOR_WALL = '#e67e22';
var COLOR_PACMAN = '#f1c40f';
var COLOR_DOT = '#fdebd0';
var COLOR_PELLET = '#e67e22';
var COLOR_FRIGHTENED = '#3498db';
var GHOST_COLORS = ['#e74c3c', '#fd79a8', '#00cec9', '#f39c12'];

// SET LEVEL FROM URL
// ------------------
var setLevel = function() {
    var url = location.href;
    level = parseInt(url.substring(url.indexOf("&") + 1, url.length)) || 1;
}
setLevel();

var getLevelName = function(i) {
    if (i == 1) return 'Novice';
    if (i == 2) return 'Average';
    if (i == 3) return 'Experienced';
    if (i == 4) return 'Skilled';
    if (i == 5) return 'Masterful';
    if (i == 6) return 'Godlike';
}

// MAZE LAYOUT
// ------------------
// 1 = wall, 0 = dot, 2 = empty, 3 = power pellet, 4 = ghost house
var mazeTemplate = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,4,4,4,4,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,2,0,2,2,2,1,4,4,4,4,4,4,4,4,1,2,2,2,0,2,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,4,4,4,4,4,4,4,4,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,3,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Deep copy the maze so we can reset it
var maze = [];
var totalDots = 0;
var dotsEaten = 0;

var initMaze = function() {
    maze = [];
    totalDots = 0;
    dotsEaten = 0;
    for (var r = 0; r < rows; r++) {
        maze[r] = [];
        for (var cc = 0; cc < cols; cc++) {
            maze[r][cc] = mazeTemplate[r][cc];
            if (maze[r][cc] === 0 || maze[r][cc] === 3) {
                totalDots++;
            }
        }
    }
}
initMaze();

// DRAW MAZE WALLS (static, drawn once on cnv)
// ------------------
var drawMaze = function() {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, width, height);
    for (var r = 0; r < rows; r++) {
        for (var cc = 0; cc < cols; cc++) {
            if (mazeTemplate[r][cc] === 1) {
                ctx.fillStyle = COLOR_WALL;
                ctx.fillRect(cc * cellSize, r * cellSize, cellSize, cellSize);
                // Draw inner darker rect for depth effect
                ctx.fillStyle = '#d35400';
                ctx.fillRect(cc * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);
            }
        }
    }
}
drawMaze();

// DRAW DOTS (on cnv2)
// ------------------
var drawDots = function() {
    ctx2.clearRect(0, 0, width, height);
    for (var r = 0; r < rows; r++) {
        for (var cc = 0; cc < cols; cc++) {
            if (maze[r][cc] === 0) {
                ctx2.fillStyle = COLOR_DOT;
                ctx2.beginPath();
                ctx2.arc(cc * cellSize + cellSize / 2, r * cellSize + cellSize / 2, 2, 0, Math.PI * 2);
                ctx2.fill();
            } else if (maze[r][cc] === 3) {
                ctx2.fillStyle = COLOR_PELLET;
                ctx2.beginPath();
                ctx2.arc(cc * cellSize + cellSize / 2, r * cellSize + cellSize / 2, 6, 0, Math.PI * 2);
                ctx2.fill();
            }
        }
    }
}
drawDots();

// HELPER: check if a cell is walkable
var isWalkable = function(col, row) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return false;
    }
    var cell = mazeTemplate[row][col];
    return cell !== 1;
}

// OBJECTS & DEFINITIONS
// ----------------------------------------

// Points
// ---------------
function Points(pts) {
    this.pts = pts;
}
Points.prototype.add = function(amount) {
    this.pts = this.pts + amount;
}
Points.prototype.reset = function() {
    this.pts = 0;
}

// Pacman
// ---------------
function Pacman(col, row) {
    this.col = col;
    this.row = row;
    this.x = col * cellSize;
    this.y = row * cellSize;
    this.dir = 'right';
    this.nextDir = 'right';
    this.mouthOpen = 0;
    this.mouthDir = 1;
    this.moving = false;
}

Pacman.prototype.setDir = function(keycode) {
    if (keycode == 37) this.nextDir = 'left';
    if (keycode == 38) this.nextDir = 'up';
    if (keycode == 39) this.nextDir = 'right';
    if (keycode == 40) this.nextDir = 'down';
}

Pacman.prototype.getNextCell = function(dir) {
    var nc = this.col;
    var nr = this.row;
    if (dir === 'left') nc--;
    if (dir === 'right') nc++;
    if (dir === 'up') nr--;
    if (dir === 'down') nr++;
    // Tunnel wrap
    if (nc < 0) nc = cols - 1;
    if (nc >= cols) nc = 0;
    return { col: nc, row: nr };
}

Pacman.prototype.move = function() {
    // Try nextDir first
    var next = this.getNextCell(this.nextDir);
    if (isWalkable(next.col, next.row)) {
        this.dir = this.nextDir;
        this.col = next.col;
        this.row = next.row;
        this.moving = true;
    } else {
        // Try current dir
        next = this.getNextCell(this.dir);
        if (isWalkable(next.col, next.row)) {
            this.col = next.col;
            this.row = next.row;
            this.moving = true;
        } else {
            this.moving = false;
        }
    }
    this.x = this.col * cellSize;
    this.y = this.row * cellSize;

    // Eat dot
    if (maze[this.row][this.col] === 0) {
        maze[this.row][this.col] = 2;
        dotsEaten++;
        points.add(10);
        // Clear dot from cnv2
        ctx2.clearRect(this.col * cellSize, this.row * cellSize, cellSize, cellSize);
        updatePoints();
    }
    // Eat power pellet
    if (maze[this.row][this.col] === 3) {
        maze[this.row][this.col] = 2;
        dotsEaten++;
        points.add(50);
        ctx2.clearRect(this.col * cellSize, this.row * cellSize, cellSize, cellSize);
        updatePoints();
        frightenGhosts();
    }

    // Check win
    if (dotsEaten >= totalDots) {
        game.win();
    }
}

Pacman.prototype.render = function() {
    var cx = this.x + cellSize / 2;
    var cy = this.y + cellSize / 2;
    var radius = cellSize / 2 - 1;

    // Animate mouth
    this.mouthOpen += 0.15 * this.mouthDir;
    if (this.mouthOpen > 0.3) this.mouthDir = -1;
    if (this.mouthOpen < 0.02) this.mouthDir = 1;

    var mouthAngle = this.mouthOpen * Math.PI;
    var startAngle, endAngle;

    if (this.dir === 'right') {
        startAngle = mouthAngle;
        endAngle = Math.PI * 2 - mouthAngle;
    } else if (this.dir === 'left') {
        startAngle = Math.PI + mouthAngle;
        endAngle = Math.PI - mouthAngle;
    } else if (this.dir === 'up') {
        startAngle = Math.PI * 1.5 + mouthAngle;
        endAngle = Math.PI * 1.5 - mouthAngle;
    } else if (this.dir === 'down') {
        startAngle = Math.PI * 0.5 + mouthAngle;
        endAngle = Math.PI * 0.5 - mouthAngle;
    }

    ctx3.fillStyle = COLOR_PACMAN;
    ctx3.beginPath();
    ctx3.moveTo(cx, cy);
    ctx3.arc(cx, cy, radius, startAngle, endAngle);
    ctx3.closePath();
    ctx3.fill();
}

Pacman.prototype.touchedGhost = function(ghost) {
    return this.col === ghost.col && this.row === ghost.row;
}

// Ghost
// ---------------
function Ghost(col, row, color, type) {
    this.col = col;
    this.row = row;
    this.startCol = col;
    this.startRow = row;
    this.x = col * cellSize;
    this.y = row * cellSize;
    this.color = color;
    this.type = type;
    this.dir = 'up';
    this.frightened = false;
    this.eaten = false;
    this.inHouse = true;
    this.houseTimer = 0;
}

Ghost.prototype.getOpposite = function(dir) {
    if (dir === 'left') return 'right';
    if (dir === 'right') return 'left';
    if (dir === 'up') return 'down';
    if (dir === 'down') return 'up';
}

Ghost.prototype.getNextCell = function(dir) {
    var nc = this.col;
    var nr = this.row;
    if (dir === 'left') nc--;
    if (dir === 'right') nc++;
    if (dir === 'up') nr--;
    if (dir === 'down') nr++;
    // Tunnel wrap
    if (nc < 0) nc = cols - 1;
    if (nc >= cols) nc = 0;
    return { col: nc, row: nr };
}

Ghost.prototype.isWalkableForGhost = function(col, row) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    var cell = mazeTemplate[row][col];
    return cell !== 1;
}

Ghost.prototype.move = function() {
    // If in ghost house, move out
    if (this.inHouse) {
        this.houseTimer++;
        var exitDelay = this.type * 30; // stagger ghost exits
        if (this.houseTimer > exitDelay) {
            this.col = 14;
            this.row = 8;
            this.x = this.col * cellSize;
            this.y = this.row * cellSize;
            this.inHouse = false;
            this.dir = 'left';
        }
        return;
    }

    // Find valid directions (not wall, not reverse)
    var dirs = ['up', 'down', 'left', 'right'];
    var opposite = this.getOpposite(this.dir);
    var validDirs = [];

    for (var i = 0; i < dirs.length; i++) {
        if (dirs[i] === opposite) continue;
        var next = this.getNextCell(dirs[i]);
        if (this.isWalkableForGhost(next.col, next.row)) {
            validDirs.push(dirs[i]);
        }
    }

    // If no valid dirs (dead end), allow reverse
    if (validDirs.length === 0) {
        var rev = this.getNextCell(opposite);
        if (this.isWalkableForGhost(rev.col, rev.row)) {
            validDirs.push(opposite);
        }
    }

    if (validDirs.length === 0) return;

    var chosenDir;
    if (this.frightened) {
        // Random direction
        chosenDir = validDirs[Math.floor(Math.random() * validDirs.length)];
    } else {
        // Chase: pick direction closest to Pacman
        var minDist = Infinity;
        chosenDir = validDirs[0];
        for (var j = 0; j < validDirs.length; j++) {
            var next = this.getNextCell(validDirs[j]);
            var dx = next.col - pacman.col;
            var dy = next.row - pacman.row;
            var dist = dx * dx + dy * dy;
            if (dist < minDist) {
                minDist = dist;
                chosenDir = validDirs[j];
            }
        }
    }

    this.dir = chosenDir;
    var nextCell = this.getNextCell(this.dir);
    this.col = nextCell.col;
    this.row = nextCell.row;
    this.x = this.col * cellSize;
    this.y = this.row * cellSize;
}

Ghost.prototype.render = function() {
    var cx = this.x + cellSize / 2;
    var cy = this.y + cellSize / 2;
    var r = cellSize / 2 - 1;

    var color = this.frightened ? COLOR_FRIGHTENED : this.color;
    ctx3.fillStyle = color;

    // Ghost body - rounded top, wavy bottom
    ctx3.beginPath();
    ctx3.arc(cx, cy - 2, r, Math.PI, 0, false);
    ctx3.lineTo(cx + r, cy + r);
    // Wavy bottom
    var waveCount = 3;
    var waveWidth = (r * 2) / waveCount;
    for (var w = 0; w < waveCount; w++) {
        var wx = cx + r - (w * waveWidth) - waveWidth / 2;
        ctx3.quadraticCurveTo(cx + r - (w * waveWidth) - waveWidth / 4, cy + r - 3, wx, cy + r);
        ctx3.quadraticCurveTo(cx + r - (w * waveWidth) - waveWidth * 3 / 4, cy + r + 3, cx + r - ((w + 1) * waveWidth), cy + r);
    }
    ctx3.closePath();
    ctx3.fill();

    // Eyes
    if (!this.frightened) {
        ctx3.fillStyle = '#fff';
        ctx3.beginPath();
        ctx3.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
        ctx3.arc(cx + 3, cy - 3, 3, 0, Math.PI * 2);
        ctx3.fill();
        // Pupils
        ctx3.fillStyle = '#333';
        var px = 0, py = 0;
        if (this.dir === 'left') px = -1;
        if (this.dir === 'right') px = 1;
        if (this.dir === 'up') py = -1;
        if (this.dir === 'down') py = 1;
        ctx3.beginPath();
        ctx3.arc(cx - 3 + px, cy - 3 + py, 1.5, 0, Math.PI * 2);
        ctx3.arc(cx + 3 + px, cy - 3 + py, 1.5, 0, Math.PI * 2);
        ctx3.fill();
    } else {
        // Frightened eyes - simple white dots
        ctx3.fillStyle = '#fff';
        ctx3.beginPath();
        ctx3.arc(cx - 3, cy - 2, 2, 0, Math.PI * 2);
        ctx3.arc(cx + 3, cy - 2, 2, 0, Math.PI * 2);
        ctx3.fill();
    }
}

Ghost.prototype.frighten = function() {
    this.frightened = true;
}

Ghost.prototype.reset = function() {
    this.col = this.startCol;
    this.row = this.startRow;
    this.x = this.col * cellSize;
    this.y = this.row * cellSize;
    this.dir = 'up';
    this.frightened = false;
    this.inHouse = true;
    this.houseTimer = 0;
}

// Game
// -----------
function Game() {
    this.isOver = false;
    this.isPaused = true;
    this.lives = 3;
}

Game.prototype.pause = function() {
    clearInterval(pacmanInterval);
    clearInterval(ghostInterval);
    document.getElementById('paused').style.display = "inline";
    paused = true;
    this.isPaused = true;
}

Game.prototype.restart = function() {
    clearInterval(pacmanInterval);
    clearInterval(ghostInterval);
    pacmanInterval = setInterval(movePacman, 150);
    ghostInterval = setInterval(moveGhosts, Math.max(300 / level, 80));
    document.getElementById('paused').style.display = "none";
    document.getElementById('instructions').style.display = "none";
    paused = false;
    this.isPaused = false;
}

Game.prototype.end = function() {
    clearInterval(pacmanInterval);
    clearInterval(ghostInterval);
    clearInterval(frightenTimer);
    this.isOver = true;
    document.getElementById('game-over').style.display = "inline";
}

Game.prototype.win = function() {
    clearInterval(pacmanInterval);
    clearInterval(ghostInterval);
    clearInterval(frightenTimer);
    document.getElementById('you-win').style.display = "inline";
}

Game.prototype.loseLife = function() {
    this.lives--;
    updateLives();
    if (this.lives <= 0) {
        this.end();
        return;
    }
    // Reset positions
    pacman.col = 14;
    pacman.row = 16;
    pacman.x = pacman.col * cellSize;
    pacman.y = pacman.row * cellSize;
    pacman.dir = 'right';
    pacman.nextDir = 'right';
    for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].reset();
    }
}

// KEYBOARD CONTROL
// --------------------
addEventListener("keydown", function (e) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        e.preventDefault();
        pacman.setDir(e.keyCode);
    }
    if (e.keyCode == 32) {
        e.preventDefault();
        if (paused) {
            game.restart();
        } else {
            game.pause();
        }
    }
}, false);

// APPLICATION
// --------------------
var game = new Game();
var points = new Points(0);
var pacman = new Pacman(14, 16);
var ghosts = [
    new Ghost(13, 11, GHOST_COLORS[0], 0), // Blinky (red)
    new Ghost(14, 11, GHOST_COLORS[1], 1), // Pinky
    new Ghost(15, 11, GHOST_COLORS[2], 2), // Inky
    new Ghost(16, 11, GHOST_COLORS[3], 3)  // Clyde
];

// FRIGHTENED MODE
// --------------------
var frightenTimer;
var frightenGhosts = function() {
    clearInterval(frightenTimer);
    for (var i = 0; i < ghosts.length; i++) {
        if (!ghosts[i].inHouse) {
            ghosts[i].frighten();
        }
    }
    var frightenDuration = Math.max(6000 - (level - 1) * 800, 2000);
    frightenTimer = setTimeout(function() {
        for (var i = 0; i < ghosts.length; i++) {
            ghosts[i].frightened = false;
        }
    }, frightenDuration);
}

// MOVEMENT FUNCTIONS
// --------------------
var movePacman = function() {
    if (game.isOver) return;
    pacman.move();
    checkCollisions();
}

var moveGhosts = function() {
    if (game.isOver) return;
    for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].move();
    }
    checkCollisions();
}

var checkCollisions = function() {
    for (var i = 0; i < ghosts.length; i++) {
        if (pacman.touchedGhost(ghosts[i]) && !ghosts[i].inHouse) {
            if (ghosts[i].frightened) {
                points.add(200);
                updatePoints();
                ghosts[i].reset();
            } else {
                game.loseLife();
                return;
            }
        }
    }
}

// RENDER LOOP
// --------------------
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           function(callback) {
               window.setTimeout(callback, 1000 / 60);
           };
})();

var pelletPulse = 0;

(function animloop() {
    requestAnimFrame(animloop);
    // Clear the sprite canvas
    ctx3.clearRect(0, 0, width, height);

    // Render pulsing power pellets on cnv2
    pelletPulse += 0.05;
    for (var r = 0; r < rows; r++) {
        for (var cc = 0; cc < cols; cc++) {
            if (maze[r][cc] === 3) {
                ctx2.clearRect(cc * cellSize, r * cellSize, cellSize, cellSize);
                var pulseSize = 5 + Math.sin(pelletPulse) * 2;
                ctx2.fillStyle = COLOR_PELLET;
                ctx2.beginPath();
                ctx2.arc(cc * cellSize + cellSize / 2, r * cellSize + cellSize / 2, pulseSize, 0, Math.PI * 2);
                ctx2.fill();
            }
        }
    }

    // Render Pacman and Ghosts
    pacman.render();
    for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].render();
    }
})();

// INTERVALS
// --------------------
var pacmanInterval;
var ghostInterval;

// UPDATE HTML
// --------------
var updatePoints = function() {
    document.getElementById("points").innerHTML = points.pts + " pts";
}

var updateLives = function() {
    var livesHtml = "";
    for (var i = 0; i < game.lives; i++) {
        livesHtml += '<span style="color: ' + COLOR_PACMAN + '; font-size: 18px; margin-right: 4px;">&#9679;</span>';
    }
    document.getElementById("game-info").innerHTML = livesHtml;
}

var updateHTML = function(points, level) {
    document.getElementById("points").innerHTML = points + " pts";
    var levelHtml = "";
    for (var i = 1; i <= 6; i++) {
        levelHtml = levelHtml + '<li><a href="game.html?pacman&' + i + '">' + getLevelName(i) + '</a></li>';
    }

    var dropdownHtml1 = '<button class="btn btn-warning dropdown-toggle current-level" data-toggle="dropdown">' + getLevelName(level) + '<span class="caret"></span></button><span class="dropdown-arrow"></span><ul class="dropdown-menu dropdown-item">';

    document.getElementById("dropdown").innerHTML = dropdownHtml1 + levelHtml + '</u>';
    document.getElementById("game-over-dropdown").innerHTML = levelHtml;
    document.getElementById("you-win-dropdown").innerHTML = levelHtml;
    document.getElementById("small-instructions").innerHTML = "move with &nbsp; &#8592 &nbsp; &#8593; &nbsp; &#8594; &nbsp; &#8595;";
    updateLives();
}

// START GAME
// --------------------
updateHTML(points.pts, level);
