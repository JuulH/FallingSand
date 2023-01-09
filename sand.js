/**
 * @type HTMLCanvasElement
 */

//#region Canvas initialization
const canvas = document.getElementById('canvas');

canvas.width = 16;
canvas.height = 16;

const ctx = canvas.getContext('2d');

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const buffer = ctx.getImageData(0,0, canvas.width, canvas.height);
//#endregion

// Draw pixel to buffer
function draw(x, y, r, g, b) {
    let i = x * 4 + y * 4 * canvas.width;  // Coordinate
    buffer.data[i] = r;                    // Red
    buffer.data[i + 1] = g;                // Green
    buffer.data[i + 2] = b;                // Blue
    buffer.data[i + 3] = 255;              // Alpha
}

let offset = 0;
let scale = 4;
let bColor = [0, 0, 0];
let eColor = [255, 255, 255];

const offsetSlider = document.getElementById('offsetSlider');
const scaleSlider = document.getElementById('scaleSlider');
const beginColor = document.getElementById('beginColor');
const endColor = document.getElementById('endColor');

// Get input values
offsetSlider.addEventListener('input', (event) => {
    offset = parseInt(event.target.value);
});

scaleSlider.addEventListener('input', (event) => {
    scale = parseFloat(event.target.value);
});

beginColor.addEventListener('input', (event) => {
    bColor = hexToRgb(event.target.value);
});

endColor.addEventListener('input', (event) => {
    eColor = hexToRgb(event.target.value);
});

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

// Set random begin & end colors
function randomColor() {
    let rB = Math.floor(Math.random() * 255);
    let gB = Math.floor(Math.random() * 255);
    let bB = Math.floor(Math.random() * 255);

    bColor = [rB, gB, bB];
    beginColor.value = rgbToHex(...bColor);

    let rE = Math.floor(Math.random() * 255);
    let gE = Math.floor(Math.random() * 255);
    let bE = Math.floor(Math.random() * 255);

    eColor = [rE, gE, bE];
    endColor.value = rgbToHex(...eColor);
}

// Calculate interpolated color between begin and end color for each pixel
function gradient(offset, scale) {
    for (y = 0; y < canvas.height; y++) {
        for (x = 0; x < canvas.width; x++) {
            let factor = (x + y) / (scale * canvas.width / 512) + offset;
            // TODO: Offset factor to compensate for scaling
            let r = lerp(bColor[0], eColor[0], factor / 255);
            let g = lerp(bColor[1], eColor[1], factor / 255);
            let b = lerp(bColor[2], eColor[2], factor / 255);
            draw(x, y, ...[r, g, b]);
        }
    }
}

let mouse = {
    x: undefined,
    y: undefined
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

// Get CSS width of canvas
function getCanvasWidth() {
    return 
}

// Update loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // Clear frame

    gradient(offset, scale);

    // Draw pixel at mouse position
    if (mouse.x !== undefined && mouse.y !== undefined) {
        draw(mouse.x, mouse.y, 255, 255, 255);
    }
    //console.log(mouse);

    ctx.putImageData(buffer, 0, 0);                     // Draw buffer to screen
}

animate();