"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputWeights = void 0;
const MathUtills_1 = require("../Utils/MathUtills");
class OutputWeights {
    constructor(head) {
        this.head = head;
        this.DEFAULT_LEFT_LANDMARK = new vec2(0.6, 0.5);
        this.DEFAULT_Right_LANDMARK = new vec2(0.4, 0.5);
        this.DEFAULT_UP_LANDMARK = new vec2(0.5, 0.3);
        this.DEFAULT_DOWN_LANDMARK = new vec2(0.5, 0.7);
        this.headT = this.head.getTransform();
    }
    getWeights(faceTracked) {
        const headPosition = this.headT.getLocalPosition();
        const positionWeights = this.calculatePositionWeights();
        const rotationWeights = this.calculateRotationWeights();
        const scaleWeights = getScaleWeights(headPosition);
        const headAway = 1 - rotationWeights;
        return [Math.min(positionWeights, rotationWeights, scaleWeights), headAway];
    }
    calculatePositionWeights() {
        let leftLandmark = this.DEFAULT_LEFT_LANDMARK;
        let rightLandmark = this.DEFAULT_Right_LANDMARK;
        let upLandmark = this.DEFAULT_UP_LANDMARK;
        let downLandmark = this.DEFAULT_DOWN_LANDMARK;
        if (this.head.getFacesCount() > this.head.faceIndex) {
            leftLandmark = this.head.getLandmark(45);
            rightLandmark = this.head.getLandmark(36);
            upLandmark = this.head.getLandmark(19);
            downLandmark = this.head.getLandmark(57);
        }
        return getWeights(leftLandmark, rightLandmark, downLandmark, upLandmark);
    }
    calculateRotationWeights() {
        const headRotation = this.headT.getLocalRotation().toEulerAngles();
        const headRotationMax = Math.max(Math.abs((0, MathUtills_1.radiansToDegrees)((0, MathUtills_1.normalizeEuler)(headRotation.x))), Math.abs((0, MathUtills_1.radiansToDegrees)((0, MathUtills_1.normalizeEuler)(headRotation.y))), Math.abs((0, MathUtills_1.radiansToDegrees)((0, MathUtills_1.normalizeEuler)(headRotation.z))));
        return getRotationWeights(headRotationMax);
    }
}
exports.OutputWeights = OutputWeights;
function getWeights(leftLandmark, rightLandmark, downLandmark, upLandmark) {
    let weights;
    if (leftLandmark.x <= 0.9 && rightLandmark.x >= 0.1 && downLandmark.y <= 0.9 && upLandmark.y >= 0.1) {
        weights = 1.0;
    }
    else if (Math.max(leftLandmark.x, downLandmark.y) > 0.9 && Math.max(leftLandmark.x, downLandmark.y) < 1) {
        const positionMargin = Math.max(leftLandmark.x, downLandmark.y) - 0.9;
        weights = Math.max(-10 * positionMargin + 1, 0);
    }
    else if (Math.min(rightLandmark.x, upLandmark.y) < 0.1 && Math.max(rightLandmark.x, upLandmark.y) > 0) {
        const positionMargin = 0.1 - Math.min(rightLandmark.x, upLandmark.y);
        weights = Math.max(-10 * positionMargin + 1, 0);
    }
    else {
        weights = 0.0;
    }
    return weights;
}
function getRotationWeights(headRotationMax) {
    let rotationWeights;
    if (headRotationMax <= 60) {
        rotationWeights = 1;
    }
    else if (headRotationMax > 60 && headRotationMax <= 80) {
        rotationWeights = (80 - headRotationMax) / 20;
    }
    else {
        rotationWeights = 0;
    }
    return rotationWeights;
}
function getScaleWeights(headPosition) {
    let scaleWeights;
    if (headPosition.z >= -80 && headPosition.z <= -25) {
        scaleWeights = 1;
    }
    else if (headPosition.z < -80 && headPosition.z > -130) {
        scaleWeights = (headPosition.z + 130) / 50;
    }
    else if (headPosition.z > -25 && headPosition.z < -20) {
        scaleWeights = (-headPosition.z - 20) / 5;
    }
    else {
        scaleWeights = 0;
    }
    return scaleWeights;
}
//# sourceMappingURL=OutputWeights.js.map