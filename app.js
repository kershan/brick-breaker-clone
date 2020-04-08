var canvas;
var ctx;

//Paddle
const paddleSpeed = 10;
const paddleHeight = 20;
var paddleWidth = 80;
var paddleX;
var paddleY;

window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setNewScreen();

    addEventListener("keydown", keyDownEvent);

    requestAnimationFrame(gameUpdate);
}

function setNewScreen() {
    paddleX = canvas.width / 2 - (paddleWidth / 2);
    paddleY = canvas.height - 20;
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
            if (paddleX >= canvas.width)
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
    requestAnimationFrame(gameUpdate);
}

function drawPaddle() {
    ctx.fillStyle = 'green';
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

