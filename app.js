var canvas;
var ctx;

//Paddle
const paddleSpeed = 20;
const paddleHeight = 20;
var paddleWidth = 80;
var paddleX;
var paddleY;

//Ball
const ballSpeed = 2;
const ballStartOffset = 1;
var ballSpeedX = -ballSpeed;
var ballSpeedY = -ballSpeed;
var ballWidth = 20;
var ballHeight = 20;
var ballRangeLimitX;
var ballRangeLimitY;
var ballX;
var ballY;

//Brick
//const brickWallStart = canvas.width / 2 - (brickWidth * 2 + (brickWidth / 2) + (brickSpacing * 2));
const brickWallStart = 210;
const brickWidth = 40;
const brickHeight = 20;
const brickSpacing = 5;
var bricks = new Map();

window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setNewScreen();

    addEventListener("keydown", keyDownEvent);

    requestAnimationFrame(gameUpdate);
}

function setNewScreen() {
    ballRangeLimitX = canvas.width - ballWidth;
    ballRangeLimitY = canvas.height - ballHeight;

    //Paddle start position
    paddleX = canvas.width / 2 - (paddleWidth / 2);
    paddleY = canvas.height - paddleHeight;

    //Ball start position
    ballX = canvas.width / 2 - (ballWidth / 2);
    ballY = canvas.height - ballHeight - paddleHeight - ballStartOffset;

    //Bricks generation
    generateBricks();

    clearScreen();
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateBricks() {
    let brickX = brickWallStart
    let brickY = canvas.height / 2;

    for (var i = 0; i <= 4; i++) {
        bricks.set(i, [brickX, brickY]);
        brickX += (brickWidth + brickSpacing);
    }

}

function keyDownEvent(event) {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    switch (event.keyCode) {
        case 37: {
            //Left
            if (paddleX <= 0)
                return;

            paddleX -= paddleSpeed;
            break;
        }
        case 38: {
            //Up
            break;
        }
        case 39: {
            //Right
            if (paddleX + paddleWidth >= canvas.width)
                return;

            paddleX += paddleSpeed;
            break;
        }
        case 40: {
            //Down
            break;
        }
    }
}

function gameUpdate() {
    clearScreen();
    drawPaddle();
    drawBrick();
    drawBall();
    requestAnimationFrame(gameUpdate);
}

function drawPaddle() {
    ctx.fillStyle = 'green';
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBall() {
    updateBallDirectionForPaddle();
    updateBallDirectionForEdgeOfScreen();
    updateBallDirectionForBrick();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    ctx.fillStyle = 'red';
    ctx.fillRect(ballX, ballY, ballWidth, ballHeight);
}

function updateBallDirectionForPaddle() {
    let paddleLeftEdge = paddleX;
    let paddleRightEdge = paddleX + paddleWidth - ballWidth;
    if (ballY >= paddleY - ballHeight) {
        if (ballX >= paddleLeftEdge
            && ballX <= paddleRightEdge) {
            ballSpeedY *= -1;
        }
    }
}

function updateBallDirectionForEdgeOfScreen() {
    //Left
    if (ballX <= 0)
        ballSpeedX *= -1;
    //Top
    if (ballY <= 0)
        ballSpeedY *= -1;
    //Right
    if (ballX >= ballRangeLimitX)
        ballSpeedX *= -1;
    //Bottom
    if (ballY >= ballRangeLimitY)
        gameOver();
}

function gameOver() {
    setNewScreen();
}

function updateBallDirectionForBrick() {
    bricks.forEach(function (item, key) {
        let firstBrickLeftEdge = item[0];
        let firstBrickRightEdge = firstBrickLeftEdge + brickWidth - ballWidth;
        if (ballY <= item[1] + brickHeight
            && ballY >= item[1] - ballHeight) {
            if (ballX >= firstBrickLeftEdge
                && ballX <= firstBrickRightEdge) {
                ballSpeedY *= -1;
            }
        }
    });
}

function drawBrick() {
    ctx.fillStyle = 'pink';

    bricks.forEach(function (item) {
        ctx.fillRect(item[0], item[1], brickWidth, brickHeight);
    });


}

