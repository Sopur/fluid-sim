import * as util from "./util.js";
import { RenderingEngine } from "./render.js";
import { PhysicsEngine, EntityTypes } from "./physics.js";

const boundSize = new util.Vector2d(1000, 500);
const particleSize = 5;
const particleSpacing = 10;
const numParticles = 200;
const movementSpeed = 10;
let movement = {
    w: false,
    a: false,
    s: false,
    d: false,
};

function render(renderEngine, physicsEngine) {
    if (movement.w) renderEngine.camera.y -= movementSpeed;
    if (movement.a) renderEngine.camera.x -= movementSpeed;
    if (movement.s) renderEngine.camera.y += movementSpeed;
    if (movement.d) renderEngine.camera.x += movementSpeed;

    physicsEngine.iterations(5);
    physicsEngine.render(renderEngine);
    requestAnimationFrame(() => render(renderEngine, physicsEngine));
}

async function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const renderEngine = new RenderingEngine(canvas, ctx);
    const physicsEngine = new PhysicsEngine();
    const mouse = physicsEngine.insert(new util.Circle(0, 0, 200), EntityTypes.Puller);
    physicsEngine.insert(new util.Square(0, 0, boundSize.x, boundSize.y).center(), EntityTypes.Bound, true);

    /*
    let particlesPerRow = Math.sqrt(numParticles);
    let particlesPerCol = (numParticles - 1) / particlesPerRow + 1;
    let spacing = particleSize * 2 + particleSpacing;

    for (let i = 0; i < numParticles; i++) {
        let x = ((i % particlesPerRow) - particlesPerRow / 2 + 0.5) * spacing;
        let y = (i / particlesPerRow - particlesPerCol / 2 + 0.5) * spacing;
        physicsEngine.insert(new util.Circle(x, y, particleSize), EntityTypes.Point);
    }*/
    for (let i = 0; i < numParticles; i++) {
        let x = Math.random() * (boundSize.x / 4) - boundSize.x / 5;
        let y = Math.random() * (boundSize.y / 4) - boundSize.y / 5;
        physicsEngine.insert(new util.Circle(x, y, particleSize), EntityTypes.Point);
    }

    render(renderEngine, physicsEngine);

    window.onmousemove = function (event) {
        physicsEngine.world.pullers[mouse].x = event.clientX - renderEngine.screen.x / 2;
        physicsEngine.world.pullers[mouse].y = -(event.clientY - renderEngine.screen.y / 2);
    };

    physicsEngine.world.pullers[mouse].phantom = true;
    window.onmousedown = function (event) {
        physicsEngine.world.pullers[mouse].phantom = false;
    };

    window.onmouseup = function (event) {
        physicsEngine.world.pullers[mouse].phantom = true;
    };

    window.onkeydown = function (event) {
        const key = event.key.toLowerCase();
        if (movement[key] === undefined) return;
        movement[key] = true;
    };
    window.onkeyup = function (event) {
        const key = event.key.toLowerCase();
        if (movement[key] === undefined) return;
        movement[key] = false;
    };
}

window.onload = main;
