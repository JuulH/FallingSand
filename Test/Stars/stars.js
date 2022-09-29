/**
 * @type HTMLCanvasElement
 */

 const canvas = document.getElementById('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d');

const amountSlider = document.getElementById('amountSlider');
const clearCheck = document.getElementById('clearCheck');

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

let speed = 5;

class Star{
    constructor(){
        this.x = scale(Math.random(), 0, 1, -innerWidth/2, innerWidth / 2);
        this.y = scale(Math.random(), 0, 1, -innerHeight/2, innerHeight / 2);
        this.z = Math.random() * innerWidth;
        this.pz = this.z;
        this.radius = 2;
    }

    update(){
        this.z -= speed;

        if (this.z < 1) {
            this.x = scale(Math.random(), 0, 1, -innerWidth/2, innerWidth / 2);
            this.y = scale(Math.random(), 0, 1, -innerHeight/2, innerHeight / 2);
            this.z = Math.random() * innerWidth;

            this.pz = this.z;
        }

    }

    show(){

        let sx = scale(this.x / this.z, 0, 1, 0, innerWidth);
        let sy = scale(this.y / this.z, 0, 1, 0, innerHeight);

        let px = scale(this.x / this.pz, 0, 1, 0, innerWidth);
        let py = scale(this.y / this.pz, 0, 1, 0, innerHeight);

        this.pz = this.z;

        this.radius = scale(this.z, 0, innerWidth, 4, 0);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = 'red';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx + (innerWidth / 2), sy + (innerHeight / 2), this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

}

window.addEventListener('wheel', function(event){
    speed -= event.deltaY / 500;
    speed = Math.min(Math.max(speed, 0.1), 60);
})

let stars = [];
starAmount = 800;

amountSlider.addEventListener('input', function(event){
    
})

window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

function init() {
    for (i = 0; i < starAmount; i++) {
        stars.push(new Star());
    }
}

init();

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    stars.forEach(star => {
        star.update();
        star.show();
    })

}

animate();