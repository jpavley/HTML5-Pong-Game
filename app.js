// Pong Game
// Copyright (c) 2021 John Pavley
// Based on tutorials by Laurence Svekis
// MIT License

// create reference to canvas context for drawing
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');


// create a reset button to restart the game
const btn = document.createElement('button');
const div = document.createElement('div');
btn.textContent = "Game Reset";
btn.addEventListener('click', () => {
    player1.score = 0;
    player2.score = 0;
    ballReset();
    player1.x = 50;
    player1.y = 50;
    player2.x = 500;
    player2.y = 50;
});
document.body.append(div);
div.append(btn);

// create player 1
const player1 = {
    x:50, y:50, speed: 5, width: 35, height: 100, score: 0
};

// create player 2
const player2 = {
    x:500, y:50, speed: 5, width: 35, height: 100, score: 0
};

// set ball speed
let speed = 3;

// create ball
const ball = {
    x: canvas.width / 2, y: canvas.height / 2, 
    width: 10, height: 10,
    xs: speed, ys: -speed
};

// create key bindings for player 1
const player1Keys = {
    ArrowRight:false, ArrowLeft:false, ArrowUp:false, ArrowDown: false
};

// create key bindings for player 2
const keyz2 = {
    KeyD:false, KeyA:false, KeyW:false, KeyS: false
};

// start animation
requestAnimationFrame(draw);

// add event listeners for keys
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// track key down events
function keyDown(event) {

    if(event.code in player1Keys) {
        player1Keys[event.code] = true;
    }

    if(event.code in keyz2) {
        keyz2[event.code] = true;
    }
}

// track key up events
function keyUp(event) {
    if(event.code in player1Keys) {
        player1Keys[event.code] = false;
    }

    if(event.code in keyz2) {
        keyz2[event.code] = false;
    }
}

// reset ball when ball goes out of bounds
function ballReset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.xs = speed;
    ball.ys = -speed;
}

// update game world for player 1, player 2, and ball
function move() {
    // update player 1 (Arrow keys)
    if(player1Keys.ArrowRight && player1.x < canvas.width/2 - player1.width) {
        player1.x += player1.speed;
    } else if(player1Keys.ArrowLeft && player1.x > 0) {
        player1.x -= player1.speed;
    }
    if(player1Keys.ArrowUp) {
        player1.y -= player1.speed;
    } else if(player1Keys.ArrowDown) {
        player1.y += player1.speed;
    }

    // update player 2 (WASD keys)
    if(keyz2.KeyD && player2.x < canvas.width - player2.width) {
        player2.x += player2.speed;
    } else if(keyz2.KeyA && player2.x > canvas.width/2) {
        player2.x -= player2.speed;
    }
    if(keyz2.KeyW) {
        player2.y -= player2.speed;
    } else if(keyz2.KeyS) {
        player2.y += player2.speed;
    }

    // update ball
    ball.x += ball.xs;
    ball.y += ball.ys;

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

    // detect ball out bounds of canvas and reverse direction if true

    // if(ball.x < 0 || ball.x > canvas.width) {
    //     ball.xs *= -1;
    // }

    if(ball.y < 0 || ball.y > canvas.height) {
        ball.ys *= -1;
    }

    // detect collision with player 1 paddle
    if(checkCol(ball, player1)) {
        ball.xs *= -1;
        let playerOriginY = (player1.y + player1.height) / 2;
        let ballOriginY = (ball.y + ball.height) / 2;
        if(playerOriginY < ballOriginY) {
            ball.ys = speed;
        } else {
            ball.ys = -speed;
        }
    }

    // detect collision with player 2 paddle
    if(checkCol(ball, player2)) {
        ball.xs *= -1;
        let playerOriginY = (player2.y + player2.height) / 2;
        let ballOriginY = (ball.y + ball.height) / 2;
        if(playerOriginY < ballOriginY) {
            ball.ys = speed;
        } else {
            ball.ys = -speed;
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
        console.log(hit);
    }

    return hit
}

// update canvas based on state of game world
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    move();
    checkCol(player1, player2);

    // draw player 1 paddle
    ctx.fillStyle = 'blue';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    // draw player 2 paddle
    ctx.fillStyle = 'red';
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // draw ball
    ctx.fillStyle = 'white';
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    // draw scoreboard
    let catFace = String.fromCodePoint(0x1F431);
    let dogFace = String.fromCodePoint(0x1F436);
    let output = `${catFace} ${player1.score} vs. ${dogFace} ${player2.score}`;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'green';
    ctx.fillText(output, 300, 30);

    // udpate animation
    requestAnimationFrame(draw);
}
