/**
 * @type HTMLCanvasElement
 */

 const canvas = document.getElementById('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d');

const amountSlider = document.getElementById('amountSlider');
const clearCheck = document.getElementById('clearCheck');

function Circle(X, Y, DX, DY, R, G, B) {
    this.x = X;
    this.y = Y;
    this.dx = DX;
    this.dy = DY;
    this.r = R;
    this.g = G;
    this.b = B;
    this.radius = 30;
}

let circles = [];

amt = 400;

minV = -1;
maxV = 1;

function addCircles(amount){
    for (i = 0; i < amount; i++){
        let cx = Math.random() * canvas.width;
        let cy = Math.random() * canvas.height;
        let dx = Math.random() * (maxV - minV) + minV;
        let dy = Math.random() * (maxV - minV) + minV;
    
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
    
        circles.push(new Circle(cx, cy, dx, dy, r, g, b));
    }
}

addCircles(amt);

console.log(circles);

amountSlider.addEventListener('input', function(event){
    if (event.target.value > circles.length){
        console.log(event.target.value, 'higher', event.target.value - amt);
        addCircles(event.target.value - circles.length);
    } else {
        console.log(event.target.value, 'lower', circles.length - event.target.value);
        for (i = 0; i < circles.length - event.target.value; i++){
            circles.pop();
        }
    }
})

clearBg = true;

clearCheck.addEventListener('input', function(event){
    clearBg = event.target.checked;
})

window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

let mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
})

function animate() {
    requestAnimationFrame(animate);
    if (clearBg) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
    
    for (i in circles){
        let c = circles[i];
        c.x += c.dx;
        c.y += c.dy;

        // c.r++;
        // c.g++;
        // c.b++;

        // if(c.r > 255){
        //     c.r = 0;
        // }

        // if(c.g > 255){
        //     c.g = 0;
        // }

        // if(c.b > 255){
        //     c.b = 0;
        // }

        // if (c.x > canvas.width + 30 || c.x < -30 || c.y > canvas.height + 30 || c.y < -30) {
        //     let cx = Math.random() * canvas.width;
        //     let cy = Math.random() * canvas.height;
        //     let dx = Math.random() * (maxV - minV) + minV;
        //     let dy = Math.random() * (maxV - minV) + minV;
        //     c.x = cx;
        //     c.y = cy;
        //     c.dx = dx;
        //     c.dy = dy;
        // }

        distance = Math.abs(mouse.x - c.x) + Math.abs(mouse.y - c.y);

        if (distance < 200 && c.radius < 60) {
            c.radius += 1;
        } else if (distance > 200 && c.radius > 30){
            c.radius -= 1;
        }

        if (c.x > canvas.width + 30) {
            c.x = -30;
        }

        else if (c.x < -30) {
            c.x = canvas.width + 30;
        }

        if (c.y > canvas.height + 30) {
            c.y = -30;
        }

        else if (c.y < -30) { 
            c.y = canvas.height + 30;
        }

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2, false);

        let cr = c.r; let cg = c.b; let cb = c.b;
        ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
        ctx.stroke();
    }
}

animate();