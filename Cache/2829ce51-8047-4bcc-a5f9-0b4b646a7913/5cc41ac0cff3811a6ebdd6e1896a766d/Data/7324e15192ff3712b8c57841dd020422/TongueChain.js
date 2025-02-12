"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TongueChain = void 0;
const Point_1 = require("../Utils/Point");
const Constraint_1 = require("../Utils/Constraint");
class TongueChain {
    constructor(options) {
        this.options = options;
        this.SPEED = 0.5;
        this.initialized = false;
        this.points = [];
        this.constraints = [];
        this.joints = [];
        this.links = [];
        this.force = new vec3(-1, 0, -1);
    }
    update() {
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
    initialize() {
        this.joints.push(this.options.tongueStart, this.options.tongueMid, this.options.tongueEnd);
        this.initializeLookAt();
        this.initializeForce();
        this.initializeLinks();
        this.headJointT = this.options.headJoint.getTransform();
        this.initialized = true;
    }
    initializeLookAt() {
        const lookAt = this.options.tongueEnd.createComponent('LookAtComponent');
        lookAt.target = this.options.tongueMid;
        lookAt.worldUpVector = LookAtComponent.WorldUpVector.TargetZ;
        lookAt.aimVectors = LookAtComponent.AimVectors.NegativeXAimZUp;
    }
    initializeForce() {
        const tongueStartPosition = this.options.tongueStart.getTransform().getWorldPosition();
        const tongueMidPosition = this.options.tongueMid.getTransform().getWorldPosition();
        const tongueEndPosition = this.options.tongueEnd.getTransform().getWorldPosition();
        const tongueStartLength = tongueStartPosition.sub(tongueMidPosition).length;
        const tongueEndLength = tongueMidPosition.sub(tongueEndPosition).length;
        const averageTongueLength = (tongueStartLength + tongueEndLength) / 2;
        const normalizedTongueLength = averageTongueLength / this.options.avatarRoot.getTransform().getWorldScale().x;
        this.force = this.force.uniformScale(5 / normalizedTongueLength);
        this.acc = this.force;
    }
    initializeLinks() {
        this.joints.forEach((joint, i) => {
            const jointT = joint.getTransform();
            this.links.push({
                transform: jointT,
                startRotation: jointT.getWorldRotation(),
                startDirection: null
            });
            if (i == 0) {
                this.points.push(new Point_1.Point(0.0, jointT.getWorldPosition()));
            }
            else {
                const point = new Point_1.Point(1.0, jointT.getWorldPosition());
                this.points.push(point);
                this.constraints.push(new Constraint_1.Constraint(this.points[i - 1], this.points[i], 1.0, true));
                this.links[i - 1].startDirection = this.points[i].position.sub(this.points[i - 1].position);
            }
        });
    }
}
exports.TongueChain = TongueChain;
//# sourceMappingURL=TongueChain.js.map