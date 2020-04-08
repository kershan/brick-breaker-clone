var canvas;
var ctx;

//Paddle
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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function keyDownEvent(event) {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    switch(event.keyCode) {
        case 37: {
            //Left
        }
        case 38: {
            //Up
        }
        case 39: {
            //Right
        }
        case 40: {
            //Down
        }
    }
}

function gameUpdate() {
    drawPaddle();
    requestAnimationFrame(gameUpdate);
}

function drawPaddle() {
    ctx.fillStyle = 'green';
    ctx.fillRect(paddleX, paddleY, paddleWidth, 20);
}

