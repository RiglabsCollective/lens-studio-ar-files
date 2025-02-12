import { Point } from '../Utils/Point';
import { Constraint } from '../Utils/Constraint';

export interface BitmojiTongueOptions {
    tongueStart: SceneObject,
    tongueMid: SceneObject,
    tongueEnd: SceneObject,
    avatarRoot: SceneObject,
    headJoint: SceneObject,
}

type Link = {
    transform: Transform,
    startRotation: quat,
    startDirection: vec3
}

export class TongueChain {

    private readonly SPEED: number = 0.5;

    private initialized: boolean = false;

    private points: Point[] = [];
    private constraints: Constraint[] = [];
    private joints: SceneObject[] = [];
    private links: Link[] = [];
    private force: vec3 = new vec3(-1, 0, -1);

    private headJointT: Transform;

    private acc: vec3;

    constructor(private readonly options: BitmojiTongueOptions) {
    }

    update(): void {
        if (!this.initialized) {
            this.initialize();
        }
        if (this.points.length <= 0) {
            return;
        }
        this.points[0].setPosition(this.links[0].transform.getWorldPosition());
        this.acc = this.headJointT.getWorldTransform().multiplyDirection(this.force);
        for (const point of this.points) {
            point.update(getDeltaTime() * this.SPEED, this.acc);
        }
        for (let i = 0; i < 3; i++) {
            for (const constraint of this.constraints) {
                constraint.solve();
            }
        }
        this.points.forEach((point, i) => {
            this.links[i].transform.setWorldPosition(point.position);
        });
    }

    private initialize(): void {
        this.joints.push(this.options.tongueStart, this.options.tongueMid, this.options.tongueEnd);
        this.initializeLookAt();
        this.initializeForce();
        this.initializeLinks();
        this.headJointT = this.options.headJoint.getTransform();
        this.initialized = true;
    }

    private initializeLookAt(): void {
        const lookAt: LookAtComponent = this.options.tongueEnd.createComponent('LookAtComponent');
        lookAt.target = this.options.tongueMid;
        lookAt.worldUpVector = LookAtComponent.WorldUpVector.TargetZ;
        lookAt.aimVectors = LookAtComponent.AimVectors.NegativeXAimZUp;
    }

    private initializeForce(): void {
        const tongueStartPosition: vec3 = this.options.tongueStart.getTransform().getWorldPosition();
        const tongueMidPosition: vec3 = this.options.tongueMid.getTransform().getWorldPosition();
        const tongueEndPosition: vec3 = this.options.tongueEnd.getTransform().getWorldPosition();

        const tongueStartLength: number = tongueStartPosition.sub(tongueMidPosition).length;
        const tongueEndLength: number = tongueMidPosition.sub(tongueEndPosition).length;
        const averageTongueLength: number = (tongueStartLength + tongueEndLength) / 2;

        const normalizedTongueLength: number = averageTongueLength / this.options.avatarRoot.getTransform().getWorldScale().x;
        this.force = this.force.uniformScale(5 / normalizedTongueLength);
        this.acc = this.force;
    }

    private initializeLinks(): void {
        this.joints.forEach((joint: SceneObject, i: number) => {
            const jointT: Transform = joint.getTransform();
            this.links.push({
                transform: jointT,
                startRotation: jointT.getWorldRotation(),
                startDirection: null
            });
            if (i == 0) {
                this.points.push(new Point(0.0, jointT.getWorldPosition()));
            } else {
                const point: Point = new Point(1.0, jointT.getWorldPosition());
                this.points.push(point);
                this.constraints.push(new Constraint(this.points[i - 1], this.points[i], 1.0, true));
                this.links[i - 1].startDirection = this.points[i].position.sub(this.points[i - 1].position);
            }
        });
    }

}
