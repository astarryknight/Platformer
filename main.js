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
    constructor(xPos, yPos, width, height, danger=false){
        this.xPos_ = xPos;
        this.yPos_ = yPos;
        this.width_ = width;
        this.height_ = height;
        this.danger_ = danger;
    }
    get xPos(){
        return this.xPos_
    }
    get yPos(){
        return this.yPos_
    }
    get width(){
        return this.width_
    }
    get height(){
        return this.height_
    }
    set xPos(xPos){
        this.xPos_ = xPos
    }
    set yPos(yPos){
        this.yPos_ = yPos
    }
    get danger(){
        return this.danger_;
    }
}


const canvas = document.getElementById("canvas");
const ctx = canvas && canvas.getContext && canvas.getContext("2d");
function draw() {
    if (ctx) {

        var isScrolling = !(player.xPos<canvas.width/2)

        ctx.clearRect(0, 0, canvas.width, canvas.height);//clear canvas

        //draw background
        ctx.fillStyle="#4dc0ca";
        var image = new Image();
        image.src = "./background.jpg";
        var offset=(isScrolling?-(player.xPos-canvas.width/2):0)/1.5;
        ctx.drawImage(image, offset, 0, canvas.width, canvas.height)
        ctx.drawImage(image, canvas.width+offset, 0, canvas.width, canvas.height)
        ctx.drawImage(image, canvas.width*2+offset, 0, canvas.width, canvas.height)
        ctx.drawImage(image, canvas.width*3+offset, 0, canvas.width, canvas.height)
        ctx.drawImage(image, canvas.width*4+offset, 0, canvas.width, canvas.height)
        // ctx.fillRect(0,0,canvas.width, canvas.height);

        //draw bird
        ctx.shadowBlur=10;
        ctx.fillStyle="#ff00ff"
        ctx.fillRect((isScrolling?canvas.width/2:player.xPos),player.yPos,player.width, player.width);   

        //draw obstacles
        ctx.shadowColor = "gray";
        ctx.shadowOffsetY = 10;
        ctx.shadowBlur=10;
        for (let obstacle of obstacles){
            ctx.fillStyle=obstacle.danger ? "#ff3300" : "#00ffff";
            ctx.fillRect((isScrolling?obstacle.xPos-player.xPos+canvas.width/2:obstacle.xPos), obstacle.yPos, obstacle.width, obstacle.height);
        }
        ctx.fillStyle="#ffa0f0"
        var obstacle=obstacles[obstacles.length-1]
        ctx.fillRect((isScrolling?obstacle.xPos-player.xPos+canvas.width/2:obstacle.xPos), obstacle.yPos, obstacle.width, obstacle.height);
        ctx.shadowOffsetY=0;
        ctx.shadowBlur=0;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var gameSpeed=10;
var speed=gameSpeed; //inverse scale - lower number = faster speed

//objects:
var player = new Player(600-50,0,350,0);
var obstacle = new Obstacle(600,100,100,100);
var obstacles=[
    new Obstacle(100,500,100,25), new Obstacle(300,400,400,25), new Obstacle(100,225,125,25), new Obstacle(700,225,80,25), new Obstacle(850,500,125,25), 
    new Obstacle(1100,350,125,25), new Obstacle(1300,500,400,400, true), new Obstacle(2000,450,125,25), new Obstacle(2225,300,100,200, true), new Obstacle(2450,450,125,25),
    new Obstacle(2800,300,100,100)
];

var start=Date.now();
var gameOver=false;
var grounded=true;
var held=false;
var gameWin=false;

//main game loop
function loop(){
    var now = Date.now();
    if((now-start)>=speed && !gameOver){
        //calculating movement - y
        var bound = 20
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
        }

        checkCollisions();

        if(gameOver){
            alert("Game Over!");
            location.reload();
        }

        if(gameWin){
            gameOver=true;
            alert("You win!");
            location.reload();
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
    for(let obstacle of obstacles){
        if(checkObjectCollision(obstacle)){

            if(obstacle.danger){
                gameOver=true;
            }

            if(obstacle==obstacles[obstacles.length-1]){
                gameWin=true;
            }

            var initYPos = player.yPos+player.yVel

            if(initYPos>obstacle.yPos+obstacle.height){
                if(player.yVel>0){
                    player.yPos=obstacle.yPos+obstacle.height;
                    player.yVel=0;
                }
            } else{
                if(player.yPos>obstacle.yPos-player.width && player.yVel<0){
                    player.yVel=0
                    player.yPos=obstacle.yPos-player.width
                    grounded=true;
                }
                if(player.xVel>0 && !grounded){
                    player.xPos=obstacle.xPos+obstacle.width;
                    player.xVel=0;
                } else if (player.xVel<0 && !grounded){
                    player.xPos=obstacle.xPos-player.width;
                    player.xVel=0;
                }
            }
        }
    }
    return false;
}

function checkObjectCollision(obstacle){
    if(player.xPos < obstacle.xPos+obstacle.width &&
        player.xPos+player.width > obstacle.xPos &&
        player.yPos < obstacle.yPos + obstacle.height && 
        player.yPos + player.width > obstacle.yPos){
            return true;
    }
    return false;
}

//handling keypresses
addEventListener("keydown", (event) => {
    var addVel = 10;
    if (event.isComposing) {
        return;
    }
    if(event.key==" " || event.key=="ArrowUp"){
        if(grounded){
            player.yVel=20;
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

// let mx=0,my=0,mb=null;
// let dx,dy,o1;
// canvas.onmousedown=(e)=>{
//     mb=e.button;
// }
// canvas.onmouseup=()=>{
//     if (dx!=null) {
//         obstacles.push(
//             new Obstacle(dx,dy,mx-dx,my-dy)
//         );
//         o1=obstacles[obstacles.length-1];
//     }
//     dx=dy=mb=null;
// }
// canvas.onmousemove=(e)=>{
//     mx=e.clientX-canvas.offsetLeft;
//     my=e.clientY-canvas.offsetTop;
//     if (mb==0 && dx==null) {
//         dx=mx,dy=my;
//     }
// }