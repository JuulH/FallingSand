/**
 * @type HTMLCanvasElement
 */

const canvas = document.getElementById('canvas');

canvas.width = 512;
canvas.height = 512;

const ctx = canvas.getContext('2d');

buffer = ctx.getImageData(0,0, canvas.width, canvas.height);

function draw(x, y, r, g, b) {
    let i = x * 4 + y * 4 * canvas.width;  // Coordinate
    buffer.data[i] = r;                    // Red
    buffer.data[i + 1] = g;                // Green
    buffer.data[i + 2] = b;                // Blue
    buffer.data[i + 3] = 255;              // Alpha
}

for (y = 0; y < canvas.height; y++) {
    for (x = 0; x < canvas.width; x++) {
        let c = (x + y) / 4;
        draw(x, y, ...[c,c,c]);
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // Clear frame

    ctx.putImageData(buffer, 0, 0);                     // Draw buffer to screen
}

animate();