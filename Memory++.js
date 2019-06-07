var Card = function(x, y, face) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.width = 53;
};

Card.prototype.drawFaceDown = function() {
    fill(81, 179, 45);
    strokeWeight(3);
    rect(this.x, this.y, this.width, this.width+33, 10);
    image(getImage("avatars/avatar-team"), this.x+1, this.y+16, this.width, this.width);
    this.isFaceUp = false;
};

Card.prototype.drawFaceUp = function() {
    fill(29, 168, 207);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width+30, 10);
    image(this.face, this.x, this.y+20, this.width, this.width);
    this.isFaceUp = true;
};

Card.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};

// Global configuration
var NUM_COLS = 5;
var NUM_ROWS = 4;

// array of possible faces
var faces = [
    getImage("avatars/aqualine-ultimate"),
    getImage("avatars/duskpin-ultimate"),
    getImage("avatars/leafers-ultimate"),
    getImage("avatars/piceratops-ultimate"),
    getImage("avatars/primosaur-ultimate"),
    getImage("avatars/robot_female_3"),
    getImage("avatars/robot_male_3"),
    getImage("creatures/OhNoes"),
    getImage("creatures/BabyWinston"),
    getImage("avatars/starky-ultimate")
];

// Make an array which has 2 of each then randomize
var possibleFaces = faces.slice(0);
var selected = [];
for (var i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
    // Randomly pick one from the array of remaining faces
    var randomInd = floor(random(possibleFaces.length));
    var face = possibleFaces[randomInd];
    // Push onto array (twice)
    selected.push(face);
    selected.push(face);
    // Remove from array
    possibleFaces.splice(randomInd, 1);
}

// randomize the array
selected.sort(function() {
    return 0.5 - Math.random();
});

// Creating cards
var cards = [];
for (var i = 0; i < NUM_COLS; i++) {
    for (var j = 0; j < NUM_ROWS; j++) {
        cards.push(new Card(i * 77 + 10, j * 100 + 4, selected.pop()));
    }
}

background(255, 255, 255);

// drawing them face up
for (var i = 0; i < cards.length; i++) {
    cards[i].drawFaceDown();
}

var flippedTiles = [];
var delayStartFC = null;
var numTries = 0;

mouseClicked = function() {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isUnderMouse(mouseX, mouseY)) {
            if (flippedTiles.length < 2 && !cards[i].isFaceUp) {
                cards[i].drawFaceUp();
                flippedTiles.push(cards[i]);
                if (flippedTiles.length === 2) {
                    numTries++;
                    if (flippedTiles[0].face === flippedTiles[1].face) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                    }
                    delayStartFC = frameCount;
                    loop();
                }
            } 
        }
    }
    var foundAllMatches = true;
    for (var i = 0; i < cards.length; i++) {
        foundAllMatches = foundAllMatches && cards[i].isMatch;
    }
    if (foundAllMatches) {
        fill(0, 0, 0);
        textSize(20);
        text("You matched all in " + numTries + " tries!", 20, 375);
    }
};

draw = function() {
    if (delayStartFC && (frameCount - delayStartFC) > 30) {
        for (var i = 0; i < cards.length; i++) {
            if (!cards[i].isMatch) {
                cards[i].drawFaceDown();
            }
        }
        flippedTiles = [];
        delayStartFC = null;
        noLoop();
    }
};
