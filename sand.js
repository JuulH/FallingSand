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

let fps = 120; // Fps limit

// Draw pixel to buffer
// Buffer is in format [r,g,b,a,r,g,b,a....]
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
const pauseButton = document.getElementById('pause-button');
const simContainer = document.getElementById('sim-container');
const brushSlider = document.getElementById('brush-slider');
const brushLabel = document.getElementById('brush-size');

// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

// #region Input
let mouseDown = false;
let touchDown = false;

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

// Mouse input
canvas.addEventListener('mousedown', (event) => {
    if (event.button == 0) {
        mouseDown = true;
    }
});

canvas.addEventListener('mouseup', (event) => {
    mouseDown = false;
});

canvas.addEventListener('mousemove', (event) => {
    let px = mouse.x;
    let py = mouse.y;

    // Get mouse position regardless of canvas size
    mouse.x = Math.floor(event.offsetX / ratioX);
    mouse.y = Math.floor(event.offsetY / ratioY);

    if ((px != mouse.x || py != mouse.y)) {
        mouse.px = px;
        mouse.py = py;
    }
});


// Touchscreen input
// Make sure user can't accidentally scroll while using canvas
const rect = canvas.getBoundingClientRect();

canvas.addEventListener('touchstart', (event) => {
    document.body.classList.add('unscrollable'); // Make sure user can't scroll while using canvas

    // Alternative to event.offsetX/Y which doesn't work on touchscreen
    mouse.x = Math.floor((event.touches[0].pageX - rect.left) / ratioX);
    mouse.y = Math.floor((event.touches[0].pageY - rect.top) / ratioY);

    mouse.px = mouse.x;
    mouse.py = mouse.y;

    touchDown = true;
});

// Make sure user can scroll after using canvas
canvas.addEventListener('touchend', (event) => {
    document.body.classList.remove('unscrollable');
    touchDown = false;
});

window.addEventListener('touchmove', (event) => {
    let px = mouse.x;
    let py = mouse.y;

    // Alternative to event.offsetX/Y which doesn't work on touchscreen
    mouse.x = Math.floor((event.touches[0].pageX - rect.left) / ratioX);
    mouse.y = Math.floor((event.touches[0].pageY - rect.top) / ratioY);

    if(px != mouse.x || py != mouse.y) {
        mouse.px = px;
        mouse.py = py;
    }
});
// #endregion

// Create buttons to select each element
let presetBtns = elementButtons.childElementCount;

Object.keys(Elements).forEach((element, index) => {
    let btn = document.createElement('BUTTON');
    btn.innerText = element.replace(/([A-Z])/g, ' $1').trim();
    elementButtons.insertBefore(btn, elementButtons.children[elementButtons.childElementCount - presetBtns]); // Append before Clear button

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


// Update brush size using slider
let maxBrushSize = 16;

brushSlider.oninput = function() {
    brushSize = Math.round(this.value);
    brushLabel.innerText = brushSize;
}

// Keyboard input
document.addEventListener('keydown', (event) => {
    // 1-9 to select elements
    if (event.key >= 0 && event.key <= 9) {
        SelectElement(event.key - 1);
    }

    // Spacebar to pause
    if (event.key == ' ') {
        TogglePause();
    }

    // F to toggle fullscreen
    if (event.key == 'f') {
        ToggleFullScreen();
    }

    // C to clear
    if (event.key == 'c') {
        ClearCanvas();
    }

    // Brackets to change brush size
    if (event.key == '[' && brushSize > 0) {
        brushSize--;
        brushSlider.value = brushSize;
        brushLabel.innerText = brushSize;
    }

    if (event.key == ']' && brushSize < maxBrushSize) {
        brushSize++;
        brushSlider.value = brushSize;
        brushLabel.innerText = brushSize;
    }
});

//#region Simulation Controls
let paused = false;

function TogglePause() {
    paused = !paused;
    pauseButton.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}

let fullscreen = false;

function ToggleFullScreen() {
    if (!fullscreen) {
        if (simContainer.requestFullscreen) {
            simContainer.requestFullscreen();
        } else if (simContainer.mozRequestFullScreen) {
            simContainer.mozRequestFullScreen();
        } else if (simContainer.webkitRequestFullScreen) {
            simContainer.webkitRequestFullScreen();
        } else if (simContainer.msRequestFullscreen) {
            simContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    fullscreen = !fullscreen;
}

// Delete all particles
function ClearCanvas() {
    particles = [];
}

// Screen capture of canvas
function CanvasToImage() {
    // Draw background
    for (x = 0; x < canvas.width; x++) {
        for (y = 0; y < canvas.height; y++) {
            draw(x, y, 0, 0, 0);
        }
    }

    // Draw particles
    for (particle of particles) {
        draw(particle.x, particle.y, ...particle.color)
    }

    ctx.putImageData(buffer, 0, 0); // Draw buffer to canvas

    // Create resized canvas as original canvas is too small
    let resizedCanvas = document.createElement('canvas');
    let resizedContext = resizedCanvas.getContext('2d');

    resizedCanvas.width = canvas.width * 8;
    resizedCanvas.height = canvas.height * 8;

    resizedContext.imageSmoothingEnabled = false;
    resizedContext.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

    // Download image
    let img = resizedCanvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = `FallingSand - ${new Date().toLocaleDateString()}.png`;
    link.href = img;
    link.click();
}

// Export particles to JSON file
function ExportParticles() {
    let fileName = prompt('Name your creation:', 'FallingSand');
    if(!fileName) return;

    let exportData = [];

    // Loop through canvas and add particle ID to array
    for (y = 0; y < canvas.height; y++) {
        for (x = 0; x < canvas.width; x++) {
            if (CanMoveTo(x, y)) {
                exportData.push(-1);
            } else {
                exportData.push(particles.find(particle => particle.x == x && particle.y == y).id);
            }
        }
    }

    // Convert array to JSON and download
    let data = JSON.stringify(exportData);
    let blob = new Blob([data], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = `${fileName}.json`;
    link.href = url;
    link.click();
}

// Import particles from JSON file
function LoadParticles() {

    // User file input
    let file = document.createElement('input');
    file.type = 'file';
    file.accept = '.json';
    file.click();

    // On file uploaded
    file.addEventListener('change', (event) => {

        if (!paused) {
            TogglePause();
        }

        ClearCanvas();

        let reader = new FileReader();
        reader.readAsText(event.target.files[0]);

        // Parse json file & place elements
        reader.onload = (event) => {
            let data = JSON.parse(event.target.result);

            for (y = 0; y < canvas.height; y++) {
                for(x = 0; x < canvas.width; x++) {

                    let index = x + y * canvas.width;
                    if (data[index] != -1) {
                        AddElement(x, y, data[index]);
                    }
                }
            }
        }
    });
}
//#endregion

// Brush sizes
function Brush(cx, cy, size, cElement) {
    for (y = cy - size; y < cy + size + 1; y++) {
        for (x = cx - size; x < cx + size + 1; x++) {

            // Brush rounding using distance from cursor
            let distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            if (distance <= size) {
                AddElement(x, y, cElement);
            }

        }
    }
}

// Draw line between two points (used for interpolation)
// Bresenham's line algorithm
function LineTo(x1, y1, x2, y2, brushSize, cElement) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        Brush(x1, y1, brushSize, cElement);

        if ((x1 == x2) && (y1 == y2)) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x1 += sx; }
        if (e2 < dx) { err += dx; y1 += sy; }
    }
}

SelectElement(0);

let timeSinceUpdate = 0;
let frameCount = 0;
let totalFps = 0;
let currentFps = 0;
let averageFps = 0;
let brushSize = 0;

// Measure average fps every second
// TODO: Fix this :(
setInterval(() => {
    // Calculate average fps using totaltime and updates
    averageFps = Math.round(totalFps / frameCount);
    totalFps = 0;
    frameCount = 0;
}, 500);

// Update loop
function animate() {

    // Limit framerate
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps);

    timeSinceUpdate = performance.now() - start;
    currentFps = 1 / (timeSinceUpdate / 1000);
    totalFps += currentFps;
    frameCount++;

    // Clear frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    buffer.data.fill(0);

    // Update simulation
    if (!paused) {
        Simulate();
    }

    // Add selected element at mouse position
    if ((mouseDown || touchDown) && (mouse.x && mouse.y)) {
        //Brush(mouse.x, mouse.y, brushSize, activeElement);
        LineTo(mouse.px, mouse.py, mouse.x, mouse.y, brushSize, activeElement);
    }
    
    // Draw particles to buffer
    for (particle of particles) {
        draw(particle.x, particle.y, ...particle.color)
    }

    // Draw cursor at mouse position on top of everything else
    if (mouse.x !== undefined && mouse.y !== undefined) {
        draw(mouse.x, mouse.y, 255, 255, 255);
    }

    // Display debug data
    debugData.innerText = `FPS: ${Math.round(averageFps)}/${fps}\n Particles: ${particles.length}\n Active Element: ${activeElement}, ${Object.keys(Elements)[activeElement]}\n Mouse Position: ${mouse.x}, ${mouse.y}\n Previous Mouse Position: ${mouse.px}, ${mouse.py}\n Brush Size: ${brushSize}\n Can Move: ${CanMoveTo(mouse.x, mouse.y)}`;

    ctx.putImageData(buffer, 0, 0); // Draw buffer to canvas

    start = performance.now();
}

let start = performance.now();
animate();