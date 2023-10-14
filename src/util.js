class Vector2d {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2d(this.x, this.y);
    }

    add(vec) {
        let cpy = this.copy();
        cpy.x += vec.x;
        cpy.y += vec.y;
        return cpy;
    }

    sub(vec) {
        let cpy = this.copy();
        cpy.x -= vec.x;
        cpy.y -= vec.y;
        return cpy;
    }

    project(origin, scale, screen) {
        let cpy = this.copy();
        cpy.x = (cpy.x - origin.x) / scale + screen.x / 2;
        cpy.y = (-cpy.y - origin.y) / scale + screen.y / 2;
        return cpy;
    }

    projectFlat(screen) {
        let cpy = this.copy();
        cpy.x = cpy.x + screen.x / 2;
        cpy.y = cpy.y + screen.y / 2;
        return cpy;
    }

    distance(vec) {
        let y = vec.x - this.x;
        let x = vec.y - this.y;

        return Math.sqrt(x * x + y * y);
    }
}

class Circle extends Vector2d {
    constructor(x = 0, y = x, r) {
        super(x, y);
        this.r = r;
    }

    copy() {
        return new Circle(this.x, this.y, this.r);
    }
}

class Square extends Vector2d {
    constructor(x = 0, y = x, w, h) {
        super(x, y);
        this.w = w;
        this.h = h;
    }

    copy() {
        return new Square(this.x, this.y, this.w, this.h);
    }

    center() {
        return new Square(this.x - this.w / 2, this.y + this.h / 2, this.w, this.h);
    }
}

class Bound2d extends Vector2d {
    /**
     * 2d bound
     * @param {number} width width
     * @param {number} height height
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}

class Box2d {
    /**
     * Box/square geometry
     * @param {Vector2d} topLeft Point on the square
     * @param {Vector2d} topRight Point on the square
     * @param {Vector2d} bottomLeft Point on the square
     * @param {Vector2d} bottomRight Point on the square
     */
    constructor(topLeft, topRight, bottomLeft, bottomRight) {
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
    }
}

export { Vector2d, Circle, Square, Bound2d, Box2d };
