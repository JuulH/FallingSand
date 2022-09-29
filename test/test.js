/**
 * @type HTMLCanvasElement
 */

 const canvas = document.getElementById('canvas');

 const ctx = canvas.getContext('2d');
 
function Circle(X, Y, DX, DY, R, G, B) {
    this.x = X;
    this.y = Y;
    this.dx = DX;
    this.dy = DY;
    this.r = R;
    this.g = G;
    this.b = B;
}

let circles = [];

amt = 50;

minV = -.5;
maxV = .5;

for (i = 0; i < amt; i++){
    let cx = Math.random() * canvas.width;
    let cy = Math.random() * canvas.height;
    let dx = Math.random() * (maxV - minV) + minV;
    let dy = Math.random() * (maxV - minV) + minV;

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    circles.push(new Circle(cx, cy, dx, dy, r, g, b));
}

console.log(circles);

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
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
        ctx.arc(c.x, c.y, 30, 0, Math.PI * 2, false);

        let cr = c.r; let cg = c.b; let cb = c.b;
        ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
        ctx.stroke();
    }
}

animate();