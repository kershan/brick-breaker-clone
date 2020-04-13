var canvas;
var ctx;

//Game State
var level = 1;
var gameTime = 0;
const gameOverText = "GAME OVER!";
const retryButtonText = "Click anywhere to try again.";

//Paddle
const paddleSpeed = 5;
const paddleHeight = 20;
var paddleWidth = 80;
var paddleX;
var paddleY;
var paddleMoveLeft = false;
var paddleMoveRight = false;
var paddleBounced = false;

//Ball
const ballSpeed = 4;
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

//FPS
var fpsDiplayOffset;
const times = [];
let fps;

window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setNewScreen();

    addEventListener("keydown", keyDownEvent);
    addEventListener("keyup", keyUpEvent);

    requestAnimationFrame(gameUpdate);
}

function setNewScreen() {
    removeEventListener("click", mouseClickEvent);

    paddleMoveLeft = false;
    paddleMoveRight = false;

    ballRangeLimitX = canvas.width - ballWidth;
    ballRangeLimitY = canvas.height - ballHeight;

    //Paddle start position
    paddleX = canvas.width / 2 - (paddleWidth / 2);
    paddleY = canvas.height - paddleHeight;

    //Ball start position
    ballX = canvas.width / 2 - (ballWidth / 2);
    ballY = canvas.height - ballHeight - paddleHeight - ballStartOffset;

    fpsDiplayOffset = canvas.width - 45;

    //Bricks generation
    generateBricks();

    clearScreen();
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateBricks() {
    let brickY = canvas.height / 2;
    let index = 0;

    for (var j = 0; j <= level; j++) {
        let brickX = brickWallStart
        for (var i = 0; i <= 4; i++) {
            bricks.set(index, [brickX, brickY]);
            brickX += (brickWidth + brickSpacing);
            index++;
        }
        brickY -= (brickHeight + brickSpacing);
    }
}

function keyDownEvent(event) {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    switch (event.keyCode) {
        case 37: {
            //Left
            paddleMoveLeft = true;
        }
        case 38: {
            //Up
            break;
        }
        case 39: {
            //Right
            paddleMoveRight = true;
        }
        case 40: {
            //Down
            break;
        }
    }
}

function keyUpEvent(event) {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    switch (event.keyCode) {
        case 37: {
            //Left
            paddleMoveLeft = false;
        }
        case 38: {
            //Up
            break;
        }
        case 39: {
            //Right
            paddleMoveRight = false;
        }
        case 40: {
            //Down
            break;
        }
    }
}

function mouseClickEvent(event) {
    setNewScreen();
}

function gameUpdate(timestamp) {
    if (timestamp - 10 >= gameTime) {
        clearScreen();
        drawPaddle();
        drawBrick();
        drawBall();
        checkForVictory();
        gameTime = timestamp;
        showFPSCounter();
    }

    requestAnimationFrame(gameUpdate);
}

// https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html
function showFPSCounter() {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;
    ctx.fillStyle = "white";
    ctx.fillText("FPS: " + fps, fpsDiplayOffset, 10);
}

function checkForVictory() {
    if (bricks.size == 0) {
        level++;
        if (level == 5)
            level = 0;
        setNewScreen();
    }
}

function drawPaddle() {
    if (paddleMoveLeft && paddleX >= 0)
        paddleX -= paddleSpeed;
    else if (paddleMoveRight && paddleX + paddleWidth <= canvas.width)
        paddleX += paddleSpeed;


    ctx.fillStyle = 'green';
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBall() {
    paddleBounced = updateBallDirectionForPaddle();
    updateBallDirectionForEdgeOfScreen();
    updateBallDirectionForBrick();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    ctx.fillStyle = 'red';
    ctx.fillRect(ballX, ballY, ballWidth, ballHeight);
}

function drawBrick() {
    ctx.fillStyle = 'pink';

    bricks.forEach(function (item) {
        ctx.fillRect(item[0], item[1], brickWidth, brickHeight);
    });
}

function updateBallDirectionForPaddle() {
    if (checkForBallCollision(paddleX, paddleY, paddleWidth, paddleHeight)) {
        if (!paddleBounced) {
            ballSpeedY *= -1;
        }
        return true;
    }

    return false;
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

function updateBallDirectionForBrick() {
    bricks.forEach(function (item, key) {
        if (checkForBallCollision(item[0], item[1], brickWidth, brickHeight)) {
            if (checkForBallCollisionForOuterSides(item[0], brickWidth)) {
                ballSpeedX *= -1;
            } else {
                ballSpeedY *= -1;
            }
            bricks.delete(key);
        }
    });
}

function checkForBallCollisionForOuterSides(itemX, itemWidth) {
    return (ballX <= itemX + itemWidth
        && ballX + ballWidth >= itemX + itemWidth)
        || (ballX + ballWidth >= itemX
            && ballX <= itemX);
}

function checkForBallCollision(itemX, itemY, itemWidth, itemHeight) {
    return ((ballX >= itemX
        && ballX <= itemX + itemWidth
        && ballY >= itemY
        && ballY <= itemY + itemHeight)
        || (ballX + ballWidth <= itemX + itemWidth
            && ballX + ballWidth >= itemX
            && ballY + ballHeight <= itemY + itemHeight
            && ballY + ballHeight >= itemY));
}

function gameOver() {
    addEventListener("click", mouseClickEvent);
    showGameOverText();
    showRetryButtonText();
}

function showRetryButtonText() {
    ctx.fillStyle = "red";
    ctx.font = "24px serif";
    let textMetrics = ctx.measureText(retryButtonText);
    let textLength = textMetrics.actualBoundingBoxLeft
        + textMetrics.actualBoundingBoxRight;
    let textX = (canvas.width / 2) - (textLength / 2);
    ctx.fillText(retryButtonText, textX, 140);
}

function showGameOverText() {
    ctx.fillStyle = "red";
    ctx.font = "48px serif";
    let textMetrics = ctx.measureText(gameOverText);
    let textLength = textMetrics.actualBoundingBoxLeft
        + textMetrics.actualBoundingBoxRight;
    let textX = (canvas.width / 2) - (textLength / 2);
    ctx.fillText(gameOverText, textX, 80);
}

