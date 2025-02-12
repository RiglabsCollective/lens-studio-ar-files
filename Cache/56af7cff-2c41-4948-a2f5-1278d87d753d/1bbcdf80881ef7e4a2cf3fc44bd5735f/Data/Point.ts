export class Point {
    private previousPosition: vec3;

    constructor(readonly inverseMass: number, public position: vec3) {
        this.previousPosition = this.position;
    }

    update(dt: number, acc: vec3): void {
        if (this.inverseMass > 0.0) {
            const tmp = this.position;
            this.position = this.position.add(this.position.sub(this.previousPosition)).add(acc.uniformScale(dt * dt));
            this.previousPosition = tmp;
        }
    }

    addPosition(dPosition: vec3, isForce: boolean = false): void {
        if (this.inverseMass > 0.0 || isForce) {
            this.position = this.position.add(dPosition);
        }
    }

    setPosition(newPosition: vec3): void {
        this.previousPosition = this.position;
        this.position = newPosition;
    }
}
