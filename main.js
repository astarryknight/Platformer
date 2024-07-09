class Player{
    constructor(yPos, yVel, xPos, xVel){
        this.yPos_ = yPos;
        this.yVel_ = yVel;
        this.xPos_ = xPos;
        this.xVel_ = xVel;
    }
    get yPos(){
        return this.yPos_
    }
    get yVel(){
        return this.yVel_
    }
    get xPos(){
        return this.xPos_
    }
    get xVel(){
        return this.xVel_
    }
    get width(){
        return 50
    }
    set yPos(yPos){
        this.yPos_ = yPos;
    }
    set yVel(yVel){
        this.yVel_ = yVel;
    }
    set xPos(xPos){
        this.xPos_ = xPos;
    }
    set xVel(xVel){
        this.xVel_ = xVel;
    }
}

class Obstacle{
    constructor(xPos, yPos, baseHeight){
        this.xPos_ = xPos;
        this.yPos_ = yPos;
        this.baseHeight_ = baseHeight;
    }
    get xPos(){
        return this.xPos_
    }
    get yPos(){
        return this.yPos_
    }
    get baseHeight(){
        return this.baseHeight_
    }
    get width(){
        return 75;
    }
    set xPos(xPos){
        this.xPos_ = xPos
    }
    set yPos(yPos){
        this.yPos_ = yPos
    }
}

var player = new Player(600-50,0,100,0);

function draw() {
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);//clear canvas

        //draw background
        ctx.fillStyle="#4dc0ca";
        ctx.fillRect(0,0,canvas.width, canvas.height);

        //draw bird
        ctx.fillStyle="#ff00ff"
        ctx.fillRect(player.xPos,player.yPos,player.width, player.width);   
    }
}

var gameSpeed=25;
var speed=gameSpeed; //inverse scale - lower number = faster speed

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var start=Date.now();
var gameOver=false;
var grounded=true;
var held=false;

//main game loop
function loop(){
    var now = Date.now();
    if((now-start)>=speed){
        //calculating movement - y
        var bound = 15
        if(player.yVel>-bound){player.yVel+=-1};
        player.yPos-=player.yVel

        //top and bottom bounds
        if(player.yPos<0){
            player.yVel=0
            player.yPos=0
        } else if(player.yPos>canvas.height-player.width){
            player.yVel=0
            player.yPos=canvas.height-player.width
            grounded=true;
        }

        //calculating movement - x
        if(!held){
            if(player.xVel<0){
                player.xVel+=1;
            }
            else if(player.xVel>0){
                player.xVel-=1;
            }
        }

        player.xPos-=player.xVel

        //let and right bounds
        if(player.xPos<0){
            player.xPos=0;
            player.xPos=0;
        } else if(player.xPos>canvas.width-player.width){
            player.xVel=0;
            player.xPos=canvas.width-player.width;
        }

        start=now;
    }
    draw();
    //if(!gameOver){
        window.requestAnimationFrame(loop)
    //} else{
        //alert("Game Over!");
        //location.reload();
    //}
}

function checkCollisions(){
    for(let pipe of pipes){
        if(checkPipeCollision(pipe)){
            return true;
        }
    }
    return false;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function checkPipeCollision(pipe){
    if(player.xPos < pipe.xPos+pipe.width &&
        player.xPos+player.width > pipe.xPos &&
        player.yPos < pipe.yPos + pipe.width && 
        player.yPos + player.width > pipe.yPos){
            return true;
    }
    return false;
}

//handling keypresses
addEventListener("keydown", (event) => {
    var addVel = 20;
    if (event.isComposing) {
        return;
    }
    if(event.key==" " || event.key=="ArrowUp"){
        if(grounded){
            player.yVel=11;
            grounded=false;
        }
    }
    if(event.key=="ArrowLeft"){
        player.xVel=addVel;
        held=true;
    }
    if(event.key=="ArrowRight"){
        player.xVel=-addVel;
        held=true;
    }
});

addEventListener("keyup", (event) => {
    if (event.isComposing) {
        return;
    }
    if(event.key=="ArrowRight" || event.key=="ArrowLeft"){
        held=false;
    }
});

window.requestAnimationFrame(loop)