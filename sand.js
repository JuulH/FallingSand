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

let offset = 0;
let scale = 4;
let bColor = [0, 0, 0];
let eColor = [255, 255, 255];

const offsetSlider = document.getElementById('offsetSlider');
const scaleSlider = document.getElementById('scaleSlider');
const beginColor = document.getElementById('beginColor');
const endColor = document.getElementById('endColor');

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
const hexToRgb = hex =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

// https://en.wikipedia.org/wiki/Linear_interpolation
const lerp = (a, b, t) => {
    return (1 - t) * a + t * b;
}

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

function gradient(offset, scale) {
    for (y = 0; y < canvas.height; y++) {
        for (x = 0; x < canvas.width; x++) {
            let factor = (x + y) / scale + offset;
            let r = lerp(bColor[0], eColor[0], factor / 255);
            let g = lerp(bColor[1], eColor[1], factor / 255);
            let b = lerp(bColor[2], eColor[2], factor / 255);
            draw(x, y, ...[r, g, b]);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // Clear frame

    gradient(offset, scale);
    ctx.putImageData(buffer, 0, 0);                     // Draw buffer to screen
}

animate();