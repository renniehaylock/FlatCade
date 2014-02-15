var gameName;

// Get Name from url
var getGameName = function() {
    var url = location.href;
    gameName = url.substring(url.indexOf("?") + 1,url.indexOf("&"));
}
getGameName();


// Creates a script element based on the gameName
var script = document.createElement('script');
script.setAttribute('src','js/' + gameName + '.js');


// Adds a class to the body element
var addClassToBody = function(cssClass) {
    document.body.className = cssClass;
}



// DOM is updated
var updatePage = function(name) {
    document.getElementById("game-name").innerHTML = capitaliseFirstLetter(gameName);
    document.title = capitaliseFirstLetter(gameName);
    // Adds proper script
    document.body.appendChild(script);
    // Change BG color
    if (gameName == "snake") {
        addClassToBody("palette-turquoise");
    }
    if (gameName == "pacman") {
        addClassToBody("palette-sun-flower");
    }
    if (gameName == "space") {
        addClassToBody("palette-wet-asphalt");
    }
}

updatePage (gameName);


// HELPERS
// ------------------
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

