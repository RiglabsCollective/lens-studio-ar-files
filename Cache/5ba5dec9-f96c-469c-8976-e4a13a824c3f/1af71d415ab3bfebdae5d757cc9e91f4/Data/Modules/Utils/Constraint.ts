import { Point } from './Point';

export class Constraint {
    private length: number;

    constructor(private startPoint: Point, private endPoint: Point, private stiffness: number, private isRigid: boolean) {
        this.length = this.startPoint.position.distance(this.endPoint.position);
    }

    solve(): void {
        const startMass: number = this.startPoint.inverseMass;
        const endMass: number = this.endPoint.inverseMass;
        const sumMass = startMass + endMass;
        if (sumMass === 0) {
            return;
        }
        const difference: vec3 = this.startPoint.position.sub(this.endPoint.position);
        const constraint = difference.length - this.length;
        const correction = difference.normalize().uniformScale(- this.stiffness * constraint / sumMass);
        if (this.isRigid) {
            this.endPoint.addPosition(correction.uniformScale(-sumMass));
        } else {
            this.startPoint.addPosition(correction.uniformScale(startMass));
            this.endPoint.addPosition(correction.uniformScale(-endMass));
        }
    }

}
