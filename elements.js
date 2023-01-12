// Contains the classes for the different elements in the simulation

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = [255, 255, 255];
    }
}

class Sand extends Particle {
    constructor(x, y) {
        super(x, y);
        this.color = [255, 255, 0];
        this.moveablePositions = [
            [0, 1],
            [1, 1],
            [-1, 1],
        ];
    }
}

class Water extends Particle {
    constructor(x, y) {
        super(x, y);
        this.color = [0, 0, 255];
        this.moveablePositions = [
            [0, 1],
            [1, 0],
            [-1, 0],
            // [1, 1],
            // [-1, 1]
        ];
    }
}

class Wall extends Particle {
    constructor(x, y) {
        super(x, y);
        this.color = [100, 100, 100];
        this.moveablePositions = [];
    }
}

class AntiSand extends Particle {
    constructor(x, y) {
        super(x, y);
        this.color = [190, 190, 190];
        this.moveablePositions = [
            [0, -1],
            [1, -1],
            [-1, -1]
        ];
    }
}

class AntiWater extends Particle {
    constructor(x, y) {
        super(x, y);
        this.color = [75, 75, 75];
        this.moveablePositions = [
            [0, -1],
            [1, 0],
            [-1, 0]
        ];
    }
}

class Fire extends Particle {
    constructor(x, y) {
        super(x, y);
        this.color = [255, 0, 0];
        this.moveablePositions = [
            [0, 1],
            [1, 1],
            [-1, 1],
            [1, 0],
            [-1, 0]
        ];
    }
}