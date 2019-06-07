var score = 0;
var pylon = [];

var Robot = function(x, y) {
    this.x = x;
    this.y = y;
    this.img = getImage("avatars/robot_male_3");
    this.pylon = 0;
};

Robot.prototype.draw = function() {
    fill(255, 0, 0);
    this.y = constrain(this.y, 0, height-50);
    image(this.img, this.x, this.y, 40, 40);
};

Robot.prototype.fly = function() {
    this.img = getImage("avatars/robot_male_3");
    this.y -= 5;
};

Robot.prototype.fall = function() {
    this.img = getImage("avatars/robot_male_3");
    this.y += 5;
};

Robot.prototype.checkForStickTouch = function(stick) {
    if ((stick.x >= this.x && stick.x <= (this.x + 40)) &&
        (stick.y >= this.y && stick.y <= (this.y + 40))&&
        (stick.obs === 1 || stick.obs === 3 || stick.obs === 4)){
        stick.y = -400;
        this.pylon++;
        }
    else if (
        (stick.x >= this.x && stick.x <= (this.x + 40)) &&
        (stick.y >= this.y && stick.y <= (this.y + 40)) &&
        (stick.obs === 2)) {
        stick.y = -400;
        this.pylon--;
    }
    score = this.pylon;
};

var Stick = function(x, y, obs) {
    this.x = x;
    this.y = y;
    this.obs=obs; // value from 1 to 4
};

Stick.prototype.draw = function() {
    if(this.obs===1 || this.obs === 3 || this.obs === 4){ // The stick that increases score
    fill(240, 228, 8);
    } else if(this.obs === 2){ // The stick that decreases score
        fill(247, 8, 48);
    }
    rectMode(CENTER);
    rect(this.x, this.y, 5, 40);
};
    
var robot = new Robot(76, 300);

for (var i = 0; i < 80; i++) {  
    pylon.push(new Stick(i * 18 + 300, random(20, 260), round(random(1,4)))); 
    //The "obs" parameter is a number from 1 to 4 that randomly determines whether the stick is good or bad (obs)
}

var bricks = [];
for (var i = 0; i < 25; i++) { 
    bricks.push(i*20);
}


draw = function() {
    background(0, 204, 255);
    fill(196, 39, 102);
    rectMode(CORNER);
    rect(0, height*0.90, width, height*0.10);
    
    for (var i = 0; i < bricks.length; i++) {
        image(getImage("cute/RampNorth"), bricks[i], height*0.85, 20, 20);
        bricks[i] -= 1;
        if (bricks[i] <= -20) {
            bricks[i] = width;
        }
    }
    
    for (var i = 0; i < pylon.length; i++) {
        pylon[i].draw();
        robot.checkForStickTouch(pylon[i]);
        pylon[i].x -= 1;
        if(pylon[pylon.length-1].x < 0 && score >=35){ //If last stick is off screen and your score is at least 35 you win
            fill(177, 181, 62);
            stroke(179, 184, 46);
            strokeWeight(3);
            rect(40,40,320,320,40);
            fill(188, 194, 25);
            rect(50,50,300,300,40);
            for (var y=0;y<=4;y++){
            image(getImage("creatures/Hopper-Cool"),90+y*50,250,50,50);
            }
            textAlign(CENTER);
            fill(56, 54, 54);
            textSize(24);
            text("Big Dubs (W's)",80,150,200,200);
        }
    }
    textSize(15);
    text("Score: " + score, 30, 30);
    textSize(15);
  
    if (keyIsPressed && keyCode === 0) {
        robot.fly();
    } else {
        robot.fall();
    }
    robot.draw();
};
