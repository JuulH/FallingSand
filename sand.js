/**
 * @type HTMLCanvasElement
 */

const canvas = document.getElementById('canvas');

canvas.width = 512;
canvas.height = 512;

const ctx = canvas.getContext('2d');

buffer = ctx.getImageData(0,0, canvas.width, canvas.height);

function draw() {
    for (i = 0; i < buffer.data.length; i += 4) {
        let r = Math.random() * 255;
        let g = Math.random() * 255;
        let b = Math.random() * 255;

        buffer.data[i] = r;
        buffer.data[i + 1] = g;
        buffer.data[i + 2] = b;
        buffer.data[i + 3] = 255;
    }
}

draw();
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.putImageData(buffer, 0, 0);
}

animate();