let particles = [];

const Elements = {
    Sand: 0,
    Water: 1,
    Wall: 2,
    Eraser: 3
};

function AddElement(x, y, element) {
    if(!CanMoveTo(x, y) && element != Elements.Eraser) {
        return;
    }

    switch (element) {
        case Elements.Sand:
            particles.push(new Sand(x, y));
            break;
        case Elements.Water:
            particles.push(new Water(x, y));
            break;
        case Elements.Wall:
            particles.push(new Wall(x, y));
            break;
        case Elements.Eraser:
            for (const [index, particle] of particles.entries()) {
                if (particle.x == x && particle.y == y) {
                    particles.splice(index, 1);
                    break;
                }
            }
    }
}

// Check if any coordinate is a valid and empty spot
function CanMoveTo(x, y) {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        return false;
    }

    for (particle of particles) {
        if (particle.x == x && particle.y == y) {
            return false;
        }
    }

    return true;
}

// Advance simulation by one step
function Simulate() {
    for(const [id, particle] of particles.entries()) {
        for (moveablePosition of particle.moveablePositions) {
            if (CanMoveTo(particle.x + moveablePosition[0], particle.y + moveablePosition[1])) {
                particle.x += moveablePosition[0];
                particle.y += moveablePosition[1];
                // console.log(id + " Moved particle to " + moveablePosition[0] + ", " + moveablePosition[1])
                break;
            } else {
                // console.log(id + " Couldn't move particle to " + moveablePosition[0] + ", " + moveablePosition[1]);
            }
        }
    }
}
