import * as util from "./util.js";
import * as kernel from "./kernels.js";
import { perc2color } from "./gradient.js";

const maxRenderDisplacement = 2;
const pullerStrength = 50;
const h = 0.001;
const influenceSize = 100;
const collisionDamping = 0.9;
const movementDamping = 0.9;
const gravityForce = -20;
const hX = new util.Vector2d(h, 0);
const hY = new util.Vector2d(0, h);

class Entity extends util.Vector2d {
    constructor(id, type, x = 0, y = x, keepInside = true, unmovable = false, phantom = false, r = 0, w = 0, h = 0) {
        super(x, y);
        this.id = id;
        this.type = type;
        this.keepInside = keepInside;
        this.unmovable = unmovable;
        this.phantom = phantom;
        this.r = r;
        this.w = w;
        this.h = h;
        this.v = new util.Vector2d();
        this.f = new util.Vector2d();
        this.direction = 0;
        this.dist = 0;
    }

    copy() {
        return new Entity(this.id, this.type, this.x, this.y, this.keepInside, this.unmovable, this.phantom, this.r, this.w, this.h);
    }
}

const EntityTypes = {
    Point: 0,
    Bound: 1,
    Puller: 2,
    0: "Point",
    1: "Bound",
    2: "Puller",
};

class PhysicsEngine {
    constructor() {
        this.currentID = 0;
        this.pointAmount = 0;
        this.world = {
            points: {},
            bounds: {},
            pullers: {},
        };
    }

    nextID() {
        return this.currentID++;
    }

    insert(data, type, keepInside = false) {
        const id = this.nextID();
        let entity = new Entity(id, type, data.x, data.y, keepInside);
        switch (type) {
            case EntityTypes.Point: {
                entity.r = data.r;
                this.world.points[id] = entity;
                this.pointAmount++;
                break;
            }
            case EntityTypes.Bound: {
                entity.w = data.w;
                entity.h = data.h;
                entity.unmovable = true;
                this.world.bounds[id] = entity;
                break;
            }
            case EntityTypes.Puller: {
                entity.r = data.r;
                this.world.pullers[id] = entity;
                break;
            }
            default: {
                throw new Error(`Bad entity type in insert (#${type})`);
            }
        }
        return id;
    }

    calcDistances(target) {
        let distances = 0;

        for (const id in this.world.points) {
            if (id == target.id) continue;
            const candidate = this.world.points[id];
            const dist = target.distance(candidate);
            distances += kernel.cubed(influenceSize, dist);
        }
        return distances;
    }

    fixPositions(target) {
        for (const id in this.world.bounds) {
            const candidate = this.world.bounds[id];
            const halfSize = new util.Vector2d(candidate.w / 2 - target.r, candidate.h / 2 - target.r);
            if (candidate.keepInside) {
                if (Math.abs(target.x) > halfSize.x) {
                    target.x = halfSize.x * Math.sign(target.x);
                    target.v.x *= -1 * collisionDamping;
                }
                if (Math.abs(target.y) > halfSize.y) {
                    target.y = halfSize.y * Math.sign(target.y);
                    target.v.y *= -1 * collisionDamping;
                } else {
                    // Never implemented obstacles lmao, too lazy
                }
            }
        }
        return target;
    }

    resolvePointCollisions(target) {
        this.fixPositions(target);

        const fixRate = 0.001;
        const currentDist = this.calcDistances(target);
        const newDistX = this.calcDistances(target.add(hX));
        const newDistY = this.calcDistances(target.add(hY));
        target.f.x -= ((newDistX - currentDist) / h) * fixRate;
        target.f.y -= ((newDistY - currentDist) / h) * fixRate;
        target.dist = currentDist;
    }

    iteration(dt = 1) {
        for (const id in this.world.points) {
            let entity = this.world.points[id];
            if (entity.unmovable) continue;
            const oldEntity = entity.copy();
            entity.f = new util.Vector2d(0, gravityForce);
            this.resolvePointCollisions(entity);

            for (const id in this.world.pullers) {
                const puller = this.world.pullers[id];
                if (puller.phantom) continue;
                if (entity.distance(puller) < puller.r) {
                    const theta = Math.atan2(puller.y - entity.y, puller.x - entity.x);
                    entity.f.x += Math.cos(theta) * pullerStrength;
                    entity.f.y += Math.sin(theta) * pullerStrength;
                }
            }

            entity.v.x += entity.f.x * dt;
            entity.v.y += entity.f.y * dt;
            entity.x += entity.v.x * dt;
            entity.y += entity.v.y * dt;

            entity.v.x *= movementDamping;
            entity.v.y *= movementDamping;
            entity.direction = Math.atan2(entity.y - oldEntity.y, entity.x - oldEntity.x);
        }
    }

    iterations(its = 1) {
        const dt = 1 / its;
        for (let i = 0; i < its; i++) {
            this.iteration(dt);
        }
    }

    render(engine) {
        engine.reset();
        for (const id in this.world.points) {
            const entity = this.world.points[id];
            engine.circle(entity, "cyan");

            // To show displacement
            // const displacement = Math.min(Math.abs(entity.v.x) + Math.abs(entity.v.y), maxRenderDisplacement);
            // engine.circle(entity, perc2color((displacement / maxRenderDisplacement) * 100));

            // To show collision boxes, if I added them lmao
            // const box = new util.Square(entity.x, entity.y, entity.r ** 2, entity.r ** 2).center();
            // engine.square(box, "purple");

            // To show direction
            // engine.line(entity, entity.direction, "green");

            // To show distance
            // engine.text(entity.add(new util.Vector2d(0, 20)), Math.round(entity.dist), "white");
        }
        for (const id in this.world.bounds) {
            const entity = this.world.bounds[id];
            engine.square(entity, "yellow");
        }
        for (const id in this.world.pullers) {
            const puller = this.world.pullers[id];

            // Render pulling
            // engine.circle(puller, puller.phantom ? "green" : "red", false);
        }
    }
}

export { PhysicsEngine, EntityTypes };
