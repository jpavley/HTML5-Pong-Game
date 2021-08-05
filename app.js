// Pong Game
// Copyright (c) 2021 John Pavley
// Based on tutorials by Laurence Svekis
// MIT License

// declare variables
let s = {
    canvas: {},
    ctx: {},
    player1: {},
    player2: {},
    ballSpeed: {},
    ball: {},
    player1Keys: {},
    player2Keys: {},    
}

initGame();

// initalize all the game vars
function initGame() {
    // create reference to canvas context for drawing
    s.canvas = document.querySelector('#myCanvas');
    s.ctx = s.canvas.getContext('2d');

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
        s.player1.score = 0;
        s.player2.score = 0;
        ballReset();
        s.player1.x = 50;
        s.player1.y = (s.canvas.height/2)-50;
        s.player2.x = 500;
        s.player2.y = (s.canvas.height/2)-50;
    });
    document.body.append(div);
    div.append(btn);    
}

// create player paddles
function createPlayers() {
    // create player 1
    s.player1 = {
        x:50, y:(s.canvas.height/2)-50, speed: 6, width: 35, height: 100, score: 0
    };
    // create player 2
    s.player2 = {
        x:500, y:(s.canvas.height/2)-50, speed: 6, width: 35, height: 100, score: 0
    };    
}

// create ball to bounce between paddles
function createBall() {
    // set ball speed
    s.ballSpeed = 3;

    // create ball
    s.ball = {
        x: s.canvas.width / 2, y: s.canvas.height / 2, 
        width: 10, height: 10,
        xs: s.ballSpeed, ys: -s.ballSpeed
    };
}

// create keybindings for each player's paddle
function createKeyBindings() {
    s.player2Keys = {
        ArrowRight:false, ArrowLeft:false, ArrowUp:false, ArrowDown: false
    };

    s.player1Keys = {
        KeyD:false, KeyA:false, KeyW:false, KeyS: false
    };    
}

// track key down events
function keyDown(event) {

    if(event.code in s.player1Keys) {
        s.player1Keys[event.code] = true;
    }

    if(event.code in s.player2Keys) {
        s.player2Keys[event.code] = true;
    }
}

// track key up events
function keyUp(event) {
    if(event.code in s.player1Keys) {
        s.player1Keys[event.code] = false;
    }

    if(event.code in s.player2Keys) {
        s.player2Keys[event.code] = false;
    }
}

// reset ball when ball goes out of boundsw
function ballReset() {
    s.ball.x = s.canvas.width / 2;
    s.ball.y = s.canvas.height / 2;
    setRandomBallSpeed();
}

function setRandomBallSpeed() {
    let direction = getRandomDirection();
    switch(direction) {
        case 0: // up right
        s.ball.xs = s.ballSpeed;
        s.ball.ys = -s.ballSpeed;
            break;
        case 1: // down left
        s.ball.xs = -s.ballSpeed;
        s.ball.ys = s.ballSpeed;
            break;
        case 2: // down right
        s.ball.xs = s.ballSpeed;
        s.ball.ys = s.ballSpeed;
            break;    
        case 3: // up left
        s.ball.xs = -s.ballSpeed;
        s.ball.ys = -s.ballSpeed;
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

    handleCollisionWithBallAndPaddle(s.player1);
    handleCollisionWithBallAndPaddle(s.player2);
}

function handlePlayer1KeyPresses() {
    if(s.player1Keys.KeyD && s.player1.x < s.canvas.width/2 - s.player1.width) {
        s.player1.x += s.player1.speed;
    } else if(s.player1Keys.KeyA && s.player1.x > 0) {
        s.player1.x -= s.player1.speed;
    }
    if(s.player1Keys.KeyW && s.player1.y > 0) {
        s.player1.y -= s.player1.speed;
    } else if(s.player1Keys.KeyS && s.player1.y < s.canvas.height - s.player1.height) {
        s.player1.y += s.player1.speed;
    }
}

function handlePlayer2KeyPresses() {
    if(s.player2Keys.ArrowRight && s.player2.x < s.canvas.width - s.player2.width) {
        s.player2.x += s.player2.speed;
    } else if(s.player2Keys.ArrowLeft && s.player2.x > s.canvas.width/2) {
        s.player2.x -= s.player2.speed;
    }
    if(s.player2Keys.ArrowUp && s.player2.y > 0) {
        s.player2.y -= s.player2.speed;
    } else if(s.player2Keys.ArrowDown && s.player2.y < s.canvas.height - s.player2.height) {
        s.player2.y += s.player2.speed;
    }
}

function updateBall() {
    s.ball.x += s.ball.xs;
    s.ball.y += s.ball.ys;    
}

function updateScores() {
        // update score for player 1
        if(s.ball.x < 0) {
            s.player1.score += 1;
            ballReset();
        }
    
        // update score for player 2
        if(s.ball.x > s.canvas.width) {
            s.player2.score += 1;
            ballReset();
        }    
}

function bounceBallOffWalls(leftRight, topBottom) {
    if(leftRight) {
        // bounce ball off of left or right walls
        if(s.ball.x + s.ball.xs < 0 || s.ball.x + s.ball.xs > s.canvas.width) {
            s.ball.xs *= -1;
        }    
    }
    if(topBottom) {
        // bounce ball off of top or bottom walls
        if(s.ball.y + s.ball.ys < 0 || s.ball.y + s.ball.ys > s.canvas.height) {
            s.ball.ys *= -1;
        }
    }
}

function handleCollisionWithBallAndPaddle(player) {
    if(hitTestWithBall(s.ball, player)) {
        s.ball.xs *= -1;
        let playerOriginY = (player.y + player.height) / 2;
        let ballOriginY = (s.ball.y + s.ball.ys + s.ball.height) / 2;
        if(playerOriginY < ballOriginY) {
            s.ball.ys = s.ballSpeed;
        } else {
            s.ball.ys = -s.ballSpeed;
        }
    }
}

// hit test bounds of ball with a paddle
// returns true if the ball makes contact with a paddle
function hitTestWithBall(ball, paddle) {

    let hit = 
    (ball.x + ball.xs + ball.width / 2) < (paddle.x + paddle.width) && 
    (ball.x + ball.xs + ball.width / 2) > paddle.x && 
    (ball.y + ball.ys + ball.height / 2) < (paddle.y + paddle.height) && 
    (ball.y + ball.ys + ball.height / 2) > paddle.y;
    
    return hit
}

// update canvas based on state of game world
function draw() {
    s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);

    move();

    drawPlayerPaddles();
    drawBall();
    drawScoreboard();

    // udpate animation
    requestAnimationFrame(draw);
}

function drawPlayerPaddles() {
    // draw player 1 paddle
    s.ctx.fillStyle = 'blue';
    s.ctx.fillRect(s.player1.x, s.player1.y, s.player1.width, s.player1.height);  
    // draw player 2 paddle
    s.ctx.fillStyle = 'red';
    s.ctx.fillRect(s.player2.x, s.player2.y, s.player2.width, s.player2.height);
}

function drawBall() {

    let ballCenterX = s.ball.x + (s.ball.width / 2);
    let ballCenterY = s.ball.y + (s.ball.height / 2);
    let ballRadius = s.ball.width / 2;

    s.ctx.beginPath();
    s.ctx.arc(ballCenterX, ballCenterY, ballRadius, 0, Math.PI * 2, true);
    s.ctx.closePath();
    s.ctx.fillStyle = 'white';
    s.ctx.fill();
}

function drawScoreboard() {
    let catFace = String.fromCodePoint(0x1F431);
    let dogFace = String.fromCodePoint(0x1F436);
    let output = `${catFace} ${s.player1.score} vs. ${dogFace} ${s.player2.score}`;
    s.ctx.font = 'bold 24px sans-serif';
    s.ctx.textAlign = 'center';
    s.ctx.fillStyle = 'green';
    s.ctx.fillText(output, 300, 30);    
}

