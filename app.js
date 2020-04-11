var canvas;
var ctx;

//Paddle
const paddleSpeed = 10;
const paddleHeight = 20;
var paddleWidth = 80;
var paddleX;
var paddleY;

//Ball
const ballSpeed = 1;
const ballStartOffset = 1;
var ballSpeedX = -ballSpeed;
var ballSpeedY = -ballSpeed;
var ballWidth = 20;
var ballHeight = 20;
var ballRangeLimitX;
var ballRangeLimitY;
var ballX;
var ballY;
var ballPaddleDirectionX = true;

//Brick
const brickWidth = 40;
const brickHeight = 20;
var bricks = [];

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
    let firstBrickX = canvas.width / 2 - brickHeight;
    let firstBrickY = canvas.height / 2;
    bricks = [[firstBrickX, firstBrickY]]

    clearScreen();
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

    if (ballPaddleDirectionX)
        ballX += ballSpeedX;
    else
        ballX -= ballSpeedX;

    ballY += ballSpeedY;
    ctx.fillStyle = 'red';
    ctx.fillRect(ballX, ballY, ballWidth, ballHeight);
}

function updateBallDirectionForPaddle() {
    var paddleLeftEdge = paddleX;
    var paddleRightEdge = paddleX + paddleWidth - ballWidth;
    if (ballY >= paddleY - ballHeight) {
        if (ballX >= paddleLeftEdge
            && ballX <= paddleRightEdge) {
            ballSpeedX *= -1;
            ballSpeedY *= -1;

            ballPaddleDirectionX = !ballPaddleDirectionX
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
        ballSpeedY *= -1;
}

function drawBrick() {
    ctx.fillStyle = 'pink';
    ctx.fillRect(bricks[0][0], bricks[0][1], brickWidth, brickHeight);
}

