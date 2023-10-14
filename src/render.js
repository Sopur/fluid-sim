import * as util from "./util.js";
const PIx2 = Math.PI * 2;

class RenderingEngine {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.scale = 1;
        this.screen = new util.Vector2d();
        this.camera = new util.Vector2d();
        this.outlineSize = 2;
        this.reset();
    }

    project(vec) {
        return vec.project(this.camera, this.scale, this.screen);
    }

    setTransform(color, opacity, x, y, rotation = 0, shadowBlur = 0) {
        this.ctx.setTransform(this.scale, 0, 0, this.scale, x, y);
        this.ctx.rotate(rotation);
        this.ctx.lineWidth = this.outlineSize;
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = shadowBlur;
        this.ctx.shadowColor = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.textAlign = "center";
        this.ctx.font = "30px serif";
    }

    reset() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.screen = new util.Vector2d(window.innerWidth, window.innerHeight);
    }

    circle(circle, color, isFill = true) {
        // Change to change visuals
        const sizeOffset = 30;
        const opacity = 0.1;

        const projected = this.project(circle);
        this.setTransform(color, opacity, projected.x, projected.y, 0, 0);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, projected.r + sizeOffset, 0, PIx2);
        if (isFill) this.ctx.fill();
        else this.ctx.stroke();
    }

    square(square, color) {
        const projected = this.project(square);
        this.setTransform(color, 1, projected.x, projected.y);
        this.ctx.strokeRect(0, 0, projected.w, projected.h);
    }

    line(center, rotation, color) {
        const projected = this.project(center);
        this.setTransform(color, 1, projected.x, projected.y, -Math.PI / 2 - rotation);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, 100);
        this.ctx.stroke();
    }

    text(center, content, color) {
        const projected = this.project(center);
        this.setTransform(color, 1, projected.x, projected.y);
        this.ctx.fillText(content, 0, 0, 1000);
    }
}

export { RenderingEngine };
