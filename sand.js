/**
 * @type HTMLCanvasElement
 */

//#region Canvas initialization
const canvas = document.getElementById('canvas');

canvas.width = 64;
canvas.height = 64;

const ctx = canvas.getContext('2d');

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const buffer = ctx.getImageData(0,0, canvas.width, canvas.height);
//#endregion

fps = 120;

// Draw pixel to buffer
function draw(x, y, r, g, b) {
    let i = x * 4 + y * 4 * canvas.width;  // Coordinate
    buffer.data[i] = r;                    // Red
    buffer.data[i + 1] = g;                // Green
    buffer.data[i + 2] = b;                // Blue
    buffer.data[i + 3] = 255;              // Alpha
}

const debugData = document.getElementById('data');

const elementButtons = document.getElementById('elements').children;

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16));
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

let mouse = {
    x: undefined,
    y: undefined,
    px: undefined,
    py: undefined
};

// Get CSS width of canvas
const cssWidth = parseInt(getComputedStyle(canvas).width);
const cssHeight = parseInt(getComputedStyle(canvas).height);

// Get ratio between canvas and CSS width
const ratioX = cssWidth / canvas.width;
const ratioY = cssHeight / canvas.height;

// Get mouse position regardless of canvas size
canvas.addEventListener('mousemove', (event) => {
    mouse.x = Math.floor(event.offsetX / ratioX);
    mouse.y = Math.floor(event.offsetY / ratioY);
});

mouseDown = false;

canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
});

canvas.addEventListener('mouseup', (event) => {
    mouseDown = false;
});

activeElement = Elements.Sand;

function SelectElement(element) {
    activeElement = element;

    for (btn of elementButtons) {
        btn.classList.remove('selected');
    }

    elementButtons[activeElement].classList.add('selected');
}

// Update loop
function animate() {

    // Limit framerate
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps)

    // Clear frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    buffer.data.fill(0);

    // Draw pixel at mouse position
    if (mouse.x !== undefined && mouse.y !== undefined) {
        draw(mouse.x, mouse.y, 255, 255, 255);
    }

    // Add selected element at mouse position
    if(mouseDown){
        //let slope = (mouse.x - mouse.px) / (mouse.y - mouse.py); // TODO: Slope
        AddElement(mouse.x, mouse.y, activeElement);
    }

    // Update simulation
    Simulate();

    // Draw particles to buffer
    for(particle of particles) {
        draw(particle.x, particle.y, ...particle.color)
    }

    // Add debug data
    debugData.innerText = `FPS: ${fps}\n Particles: ${particles.length}\n Mouse Position: ${mouse.x}, ${mouse.y}\n Can Move: ${CanMoveTo(mouse.x, mouse.y)}\n Active Element: ${activeElement}, - ${Object.keys(Elements)[activeElement]}`;

    ctx.putImageData(buffer, 0, 0); // Draw buffer to screen
}

animate();