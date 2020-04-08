
var canvas;
var ctx;

window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setNewScreen();

    requestAnimationFrame(gameUpdate);
}

function setNewScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameUpdate() {
    drawPaddle();
    requestAnimationFrame(gameUpdate);
}

function drawPaddle() {
    ctx.fillStyle = 'green';
    ctx.fillRect(canvas.width / 2 - 40, canvas.height - 20, 80, 20);
}

