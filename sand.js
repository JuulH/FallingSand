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

const buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
//#endregion

fps = 120; // Fps limit

// Draw pixel to buffer
function draw(x, y, r, g, b) {
    let i = x * 4 + y * 4 * canvas.width;  // Coordinate
    buffer.data[i] = r;                    // Red
    buffer.data[i + 1] = g;                // Green
    buffer.data[i + 2] = b;                // Blue
    buffer.data[i + 3] = 255;              // Alpha
}

// Get DOM elements
const debugData = document.getElementById('data-text');
const elementButtons = document.getElementById('elements');
const pauseButton = document.getElementById('pause-button')

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
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = Math.floor(event.offsetX / ratioX);
    mouse.y = Math.floor(event.offsetY / ratioY);
});

canvas.addEventListener('touchmove', (event) => {
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = Math.floor(event.touches[0].offsetX / ratioX);
    mouse.y = Math.floor(event.touches[0].offsetY / ratioY);
});

mouseDown = false;
touchDown = false;

canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
});

canvas.addEventListener('mouseup', (event) => {
    mouseDown = false;
});

canvas.addEventListener('touchstart', (event) => {
    touchDown = true;
});

canvas.addEventListener('touchend', (event) => {
    touchDown = false;
});

// Create buttons to select each element
Object.keys(Elements).forEach((element, index) => {
    let btn = document.createElement('BUTTON');
    btn.innerText = element;
    elementButtons.insertBefore(btn, elementButtons.children[elementButtons.childElementCount - 2]); // Append before Clear button

    // Add event listener to button to select element
    btn.addEventListener('click', (event) => {
        SelectElement(index);
    });
});

function SelectElement(element) {
    if(element < 0 || element >= Object.keys(Elements).length) {
        return;
    }

    activeElement = element;

    // Visual feedback for selected button
    for (btn of elementButtons.children) {
        btn.classList.remove('selected');
    }

    elementButtons.children[activeElement].classList.add('selected');
}

function TogglePause() {
    paused = !paused;
    pauseButton.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}

let start = Date.now();
let timeSinceUpdate = 0;
let updates = 0;
let totalTime = 0;
let averageFps = 0;

setInterval(() => {
    averageFps = totalTime / updates;
    updates = 0;
    totalTime = 0;
}, 1000);

function ClearCanvas() {
      particles = [];
}

SelectElement(0);

// Event handler for keyboard input to select elements using numbers
document.addEventListener('keydown', (event) => {
    if (event.key >= 0 && event.key <= 9) {
        SelectElement(event.key - 1);
    }
});

let paused = false;

// Update loop
function animate() {

    updates++;
    timeSinceUpdate = Date.now() - start;
    totalTime += timeSinceUpdate;

    // Limit framerate
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps);

    // Clear frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    buffer.data.fill(0);

    // Add selected element at mouse position
    if (mouseDown || touchDown) {
        AddElement(mouse.x, mouse.y, activeElement);
    }

    if (!paused) {
        // Update simulation
        Simulate();
    }
    
    // Draw particles to buffer
    for (particle of particles) {
        draw(particle.x, particle.y, ...particle.color)
    }

    // Draw pixel at mouse position
    if (mouse.x !== undefined && mouse.y !== undefined) {
        draw(mouse.x, mouse.y, 255, 255, 255);
    }

    // Add debug data
    debugData.innerText = `FPS: ${Math.round(1000 / averageFps)}/${fps}\n Particles: ${particles.length}\n Mouse Position: ${mouse.x}, ${mouse.y}\n Previous Mouse Position: ${mouse.px}, ${mouse.py}\n Can Move: ${CanMoveTo(mouse.x, mouse.y)}\n Active Element: ${activeElement}, ${Object.keys(Elements)[activeElement]}`;

    ctx.putImageData(buffer, 0, 0); // Draw buffer to screen

    start = Date.now();
}

animate();