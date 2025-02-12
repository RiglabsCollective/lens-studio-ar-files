"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(inverseMass, position) {
        this.inverseMass = inverseMass;
        this.position = position;
        this.previousPosition = this.position;
    }
    update(dt, acc) {
        if (this.inverseMass > 0.0) {
            const tmp = this.position;
            this.position = this.position.add(this.position.sub(this.previousPosition)).add(acc.uniformScale(dt * dt));
            this.previousPosition = tmp;
        }
    }
    addPosition(dPosition, isForce = false) {
        if (this.inverseMass > 0.0 || isForce) {
            this.position = this.position.add(dPosition);
        }
    }
    setPosition(newPosition) {
        this.previousPosition = this.position;
        this.position = newPosition;
    }
}
exports.Point = Point;
//# sourceMappingURL=Point.js.map