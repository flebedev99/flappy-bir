//Don't tinker with these
const plr = document.getElementById("plr");
const fbtn = document.getElementById("fbtn");
const game = document.getElementById("gamearea");
const pipe = document.getElementById("obs");
const startGameBtn = document.getElementById("startbtn");
const score = document.getElementById("sc");
const ground = document.getElementById("gr");
const prog = document.getElementById("myprog");
const load = document.getElementById("lod");
let plrY = 250;
let plrX = 150;
let plrW = 50;
let plrH = 35;
let pipeX = 600;
let pipeY = Math.floor(Math.random() * 50);
let Yvelocity = 0;
let gameOver = false;
let pipeW = 80;
let pipe1H = 200;
let pipe2H = 200;
let pipe2Y = pipeY + pipe1H;
let scoreVal = 0;
let groundS = 0.5;
let pipesCleared = 0;
let bullet;
let bulletH = 50;
let bulletW = 20;
let bulletX = plrX;
let bulletY = plrY;
let bulletsFired = 1;
//You can ajust these
let GRAVITY = 0.05; //Gravity acceleration
let JUMP_HEIGHT = 3; //How hight the player jumps
let MAX_PULL = -2; //Max gravity
let FPS = 10; //Frames Per Second
let PIPE_SPEED = 0.99; //Speed of pipes moving
let FRICTION = 1.7; //Ground friction and wind strength
let WHEN_BOSS_BATTLE = 3; //How much pipes to clear for boss battle
let LOADING_SPEED = 6000; //How fast it loads
let BULLET_SPEED = 1; //How fast the bullet moves

//game code
function createBullet() {
  bulletX = plrX;
  bulletY = plrY;
  bullet = document.createElement("img");
  bullet.style.width = bulletW + "px";
  bullet.style.height = bulletH + "px";
  bullet.style.backgroundColor = "none";
  bullet.style.position = "absolute";
  bullet.style.zIndex = 2;
  bullet.src = "src/assets/feather.png";
  bullet.style.transform = "rotate(90deg)";
  bullet.style.filter = "sepia(1)";
  ground.parentElement.appendChild(bullet);
}
function updatePlayerPosition() {
  plr.style.bottom = plrY + "px";
  plr.style.left = plrX + "px";
  plrY += Yvelocity;
}
function gravity() {
  Yvelocity -= GRAVITY;
  if (Yvelocity < MAX_PULL) {
    Yvelocity = MAX_PULL;
    plr.style.transform = "rotate(40deg)";
  }
}
function collision() {
  if (plrY < 60) {
    Yvelocity = 0;
    plrY = 60;
    plrX -= FRICTION;
    plr.style.transform = "rotate(0deg)";
  }
  if (plrY > 370) {
    Yvelocity = 0;
    plrY = 370;
    plrX -= FRICTION * 5;
    plr.style.transform = "rotate(0deg)";
  }
  if (plrX < -plrW) {
    gameOver = true;
  }
  if (
    plrX < pipeX + pipeW &&
    plrX + plrW > pipeX &&
    plrY < pipeY + pipe1H &&
    plrY + plrH > pipeY
  ) {
    plrY = 250;
    plrX = 100;
    plr.style.transform = "rotate(0deg)";
    gameOver = true;
  }
  if (
    plrX < pipeX + pipeW &&
    plrX + plrW > pipeX &&
    plrY < pipe2Y + pipe2H &&
    plrY + plrH > pipe2Y
  ) {
    plrY = 250;
    plrX = 100;
    plr.style.transform = "rotate(0deg)";
    gameOver = true;
  }
}
function scoreUpdate() {
  score.innerText = Math.floor(scoreVal);
  if (plrX < pipeX + pipeW && plrX + plrW > pipeX) {
    scoreVal += 0.01;
    pipesCleared = Math.floor(scoreVal);
  }
}
function jump() {
  Yvelocity += JUMP_HEIGHT;
  plr.style.transform = "rotate(-20deg)";
}
function gameLoop() {
  gravity();
  collision();
  updateBullet();
  updatePlayerPosition();
  updatePipePosition();
  scoreUpdate();
  accelerate();
  if (gameOver === true) {
    pipe.style.visibility = "hidden";
    startGameBtn.style.visibility = "visible";
    startGameBtn.innerText = "Play again";
    return;
  }
  setTimeout(gameLoop, FPS);
}
function accelerate() {
  FPS -= 0.001;
  groundS -= 0.00001;
  if (FPS < 1) {
    FPS = 1;
  }
  if (groundS < 0.1) {
    groundS = 0.1;
  }
  ground.style.animationDuration = groundS + "s";
}
startGameBtn.onclick = function () {
  plrY = 250;
  plrX = 150;
  pipeX = 500;
  pipeY = 0;
  Yvelocity = 0;
  gameOver = false;
  scoreVal = 0;
  FPS = 10;
  groundS = 0.3;
  scoreUpdate();
  pipe.style.visibility = "visible";
  gameLoop();
  this.style.visibility = "hidden";
};
document.body.onkeydown = function () {
  jump();
};
fbtn.onclick = function () {
  game.requestFullscreen();
};
function updatePipePosition() {
  pipe.style.left = pipeX + "px";
  pipe.style.bottom = pipeY + "px";
  pipeX -= PIPE_SPEED;
  if (pipeX < -pipeW) {
    if (!checkBossBattle()) {
      pipeX = 600;
      pipeY = randomNumber(-150, 50);
    }
  }
  pipe2Y = pipeY + pipe1H + 200;
}
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
