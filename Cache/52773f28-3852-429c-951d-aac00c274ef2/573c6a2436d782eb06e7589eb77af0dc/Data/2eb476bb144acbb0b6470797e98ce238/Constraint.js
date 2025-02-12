"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constraint = void 0;
class Constraint {
    constructor(startPoint, endPoint, stiffness, isRigid) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.stiffness = stiffness;
        this.isRigid = isRigid;
        this.length = this.startPoint.position.distance(this.endPoint.position);
    }
    solve() {
        const startMass = this.startPoint.inverseMass;
        const endMass = this.endPoint.inverseMass;
        const sumMass = startMass + endMass;
        if (sumMass === 0) {
            return;
        }
        const difference = this.startPoint.position.sub(this.endPoint.position);
        const constraint = difference.length - this.length;
        const correction = difference.normalize().uniformScale(-this.stiffness * constraint / sumMass);
        if (this.isRigid) {
            this.endPoint.addPosition(correction.uniformScale(-sumMass));
        }
        else {
            this.startPoint.addPosition(correction.uniformScale(startMass));
            this.endPoint.addPosition(correction.uniformScale(-endMass));
        }
    }
}
exports.Constraint = Constraint;
//# sourceMappingURL=Constraint.js.map