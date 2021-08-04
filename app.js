// Pong Game
// Copyright (c) 2021 John Pavley
// Based on tutorials by Laurence Svekis
// MIT License

// declare variables
let canvas;
let ctx;
let player1;
let player2;
let ballSpeed;
let ball;
let player1Keys;
let player2Keys;

initGame();

// initalize all the game vars
function initGame() {
    // create reference to canvas context for drawing
    canvas = document.querySelector('#myCanvas');
    ctx = canvas.getContext('2d');

    createResetButton();
    createPlayers();
    createBall();
    createKeyBindings();

    // start animation
    requestAnimationFrame(draw);

    // add event listeners for keys
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
}

// create a reset button to restart the game
function createResetButton() {
    const btn = document.createElement('button');
    const div = document.createElement('div');
    btn.textContent = "Game Reset";
    btn.addEventListener('click', () => {
        player1.score = 0;
        player2.score = 0;
        ballReset();
        player1.x = 50;
        player1.y = (canvas.height/2)-50;
        player2.x = 500;
        player2.y = (canvas.height/2)-50;
    });
    document.body.append(div);
    div.append(btn);    
}

// create player paddles
function createPlayers() {
    // create player 1
    player1 = {
        x:50, y:(canvas.height/2)-50, speed: 6, width: 35, height: 100, score: 0
    };
    // create player 2
    player2 = {
        x:500, y:(canvas.height/2)-50, speed: 6, width: 35, height: 100, score: 0
    };    
}

// create ball to bounce between paddles
function createBall() {
    // set ball speed
    ballSpeed = 3;

    // create ball
    ball = {
        x: canvas.width / 2, y: canvas.height / 2, 
        width: 10, height: 10,
        xs: ballSpeed, ys: -ballSpeed
    };
}

// create keybindings for each player's paddle
function createKeyBindings() {
    player2Keys = {
        ArrowRight:false, ArrowLeft:false, ArrowUp:false, ArrowDown: false
    };

    player1Keys = {
        KeyD:false, KeyA:false, KeyW:false, KeyS: false
    };    
}

// track key down events
function keyDown(event) {

    if(event.code in player1Keys) {
        player1Keys[event.code] = true;
    }

    if(event.code in player2Keys) {
        player2Keys[event.code] = true;
    }
}

// track key up events
function keyUp(event) {
    if(event.code in player1Keys) {
        player1Keys[event.code] = false;
    }

    if(event.code in player2Keys) {
        player2Keys[event.code] = false;
    }
}

// reset ball when ball goes out of boundsw
function ballReset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    setRandomBallSpeed();
}

function setRandomBallSpeed() {
    let direction = getRandomDirection();
    switch(direction) {
        case 0: // up right
            ball.xs = ballSpeed;
            ball.ys = -ballSpeed;
            break;
        case 1: // down left
            ball.xs = -ballSpeed;
            ball.ys = ballSpeed;
            break;
        case 2: // down right
            ball.xs = ballSpeed;
            ball.ys = ballSpeed;
            break;    
        case 3: // up left
            ball.xs = -ballSpeed;
            ball.ys = -ballSpeed;
            break;    
    }
}

function getRandomDirection() {
    return Math.floor(Math.random() * 4);
}

// update game world for player 1, player 2, and ball
function move() {

    handlePlayer1KeyPresses();
    handlePlayer2KeyPresses();
    updateBall();
    updateScores();

    bounceBallOffWalls(false, true);

    handleCollisionWithBallAndPaddle(player1);
    handleCollisionWithBallAndPaddle(player2);
}

function handlePlayer1KeyPresses() {
    if(player1Keys.KeyD && player1.x < canvas.width/2 - player1.width) {
        player1.x += player1.speed;
    } else if(player1Keys.KeyA && player1.x > 0) {
        player1.x -= player1.speed;
    }
    if(player1Keys.KeyW && player1.y > 0) {
        player1.y -= player1.speed;
    } else if(player1Keys.KeyS && player1.y < canvas.height - player1.height) {
        player1.y += player1.speed;
    }
}

function handlePlayer2KeyPresses() {
    if(player2Keys.ArrowRight && player2.x < canvas.width - player2.width) {
        player2.x += player2.speed;
    } else if(player2Keys.ArrowLeft && player2.x > canvas.width/2) {
        player2.x -= player2.speed;
    }
    if(player2Keys.ArrowUp && player2.y > 0) {
        player2.y -= player2.speed;
    } else if(player2Keys.ArrowDown && player2.y < canvas.height - player2.height) {
        player2.y += player2.speed;
    }
}

function updateBall() {
    ball.x += ball.xs;
    ball.y += ball.ys;    
}

function updateScores() {
        // update score for player 1
        if(ball.x < 0) {
            player1.score += 1;
            ballReset();
        }
    
        // update score for player 2
        if(ball.x > canvas.width) {
            player2.score += 1;
            ballReset();
        }    
}

function bounceBallOffWalls(leftRight, topBottom) {
    if(leftRight) {
        // bounce ball off of left or right walls
        if(ball.x + ball.xs < 0 || ball.x + ball.xs > canvas.width) {
            ball.xs *= -1;
        }    
    }
    if(topBottom) {
        // bounce ball off of top or bottom walls
        if(ball.y + ball.ys < 0 || ball.y + ball.ys > canvas.height) {
            ball.ys *= -1;
        }
    }
}

function handleCollisionWithBallAndPaddle(player) {
    if(checkCol(ball, player)) {
        ball.xs *= -1;
        let playerOriginY = (player.y + player.height) / 2;
        let ballOriginY = (ball.y + ball.height) / 2;
        if(playerOriginY < ballOriginY) {
            ball.ys = ballSpeed;
        } else {
            ball.ys = -ballSpeed;
        }
    }
}

// hit test bounds of two objects
function checkCol(obj1, obj2) {

    let hit = obj1.x < (obj2.x + obj2.width) && 
    (obj1.x + obj1.width) > obj2.x && 
    obj1.y < (obj2.y + obj2.height) && 
    (obj1.y + obj1.height) > obj2.y;
    
    if(hit) {
        //console.log(hit);
    }

    return hit
}

// update canvas based on state of game world
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    move();

    drawPlayerPaddles();
    drawBall();
    drawScoreboard();

    // udpate animation
    requestAnimationFrame(draw);
}

function drawPlayerPaddles() {
    // draw player 1 paddle
    ctx.fillStyle = 'blue';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);  
    // draw player 2 paddle
    ctx.fillStyle = 'red';
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
}

function drawBall() {

    let ballCenterX = ball.x + (ball.width / 2);
    let ballCenterY = ball.y + (ball.height / 2);
    let ballRadius = ball.width / 2;

    ctx.beginPath();
    ctx.arc(ballCenterX, ballCenterY, ballRadius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
}

function drawScoreboard() {
    let catFace = String.fromCodePoint(0x1F431);
    let dogFace = String.fromCodePoint(0x1F436);
    let output = `${catFace} ${player1.score} vs. ${dogFace} ${player2.score}`;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'green';
    ctx.fillText(output, 300, 30);    
}

