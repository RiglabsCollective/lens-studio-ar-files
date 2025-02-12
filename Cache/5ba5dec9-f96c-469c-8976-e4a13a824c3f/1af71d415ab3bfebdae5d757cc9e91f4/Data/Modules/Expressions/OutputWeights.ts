import { normalizeEuler, radiansToDegrees } from '../Utils/MathUtills';

export class OutputWeights {
    private readonly DEFAULT_LEFT_LANDMARK: vec2 = new vec2(0.6, 0.5);
    private readonly DEFAULT_Right_LANDMARK: vec2 = new vec2(0.4, 0.5);
    private readonly DEFAULT_UP_LANDMARK: vec2 = new vec2(0.5, 0.3);
    private readonly DEFAULT_DOWN_LANDMARK: vec2 = new vec2(0.5, 0.7);

    private headT: Transform;

    constructor(private head: Head) {
        this.headT = this.head.getTransform();
    }

    getWeights(faceTracked: boolean): [number, number] {
        const headPosition: vec3 = this.headT.getLocalPosition();

        const positionWeights: number = this.calculatePositionWeights();
        const rotationWeights: number = this.calculateRotationWeights();
        const scaleWeights: number = getScaleWeights(headPosition);

        const headAway = 1 - rotationWeights;
        return [Math.min(positionWeights, rotationWeights, scaleWeights), headAway];
    }

    private calculatePositionWeights(): number {
        let leftLandmark: vec2 = this.DEFAULT_LEFT_LANDMARK;
        let rightLandmark: vec2 = this.DEFAULT_Right_LANDMARK;
        let upLandmark: vec2 = this.DEFAULT_UP_LANDMARK;
        let downLandmark: vec2 = this.DEFAULT_DOWN_LANDMARK;

        if (this.head.getFacesCount() > this.head.faceIndex) {
            leftLandmark = this.head.getLandmark(45);
            rightLandmark = this.head.getLandmark(36);
            upLandmark = this.head.getLandmark(19);
            downLandmark = this.head.getLandmark(57);
        }

        return getWeights(leftLandmark, rightLandmark, downLandmark, upLandmark);
    }

    private calculateRotationWeights(): number {
        const headRotation: vec3 = this.headT.getLocalRotation().toEulerAngles();
        const headRotationMax: number = Math.max(Math.abs(radiansToDegrees(normalizeEuler(headRotation.x))),
            Math.abs(radiansToDegrees(normalizeEuler(headRotation.y))),
            Math.abs(radiansToDegrees(normalizeEuler(headRotation.z))));
        return getRotationWeights(headRotationMax);
    }
}

function getWeights(leftLandmark: vec2, rightLandmark: vec2, downLandmark: vec2, upLandmark: vec2): number {
    let weights: number;
    if (leftLandmark.x <= 0.9 && rightLandmark.x >= 0.1 && downLandmark.y <= 0.9 && upLandmark.y >= 0.1) {
        weights = 1.0;
    } else if (Math.max(leftLandmark.x, downLandmark.y) > 0.9 && Math.max(leftLandmark.x, downLandmark.y) < 1) {
        const positionMargin: number = Math.max(leftLandmark.x, downLandmark.y) - 0.9;
        weights = Math.max(- 10 * positionMargin + 1, 0);
    } else if (Math.min(rightLandmark.x, upLandmark.y) < 0.1 && Math.max(rightLandmark.x, upLandmark.y) > 0) {
        const positionMargin: number = 0.1 - Math.min(rightLandmark.x, upLandmark.y);
        weights = Math.max(- 10 * positionMargin + 1, 0);
    } else {
        weights = 0.0;
    }
    return weights;
}

function getRotationWeights(headRotationMax: number): number {
    let rotationWeights: number;
    if (headRotationMax <= 60) {
        rotationWeights = 1;
    } else if (headRotationMax > 60 && headRotationMax <= 80) {
        rotationWeights = (80 - headRotationMax) / 20;
    } else {
        rotationWeights = 0;
    }
    return rotationWeights;
}

function getScaleWeights(headPosition: vec3): number {
    let scaleWeights: number;
    if (headPosition.z >= -80 && headPosition.z <= -25) {
        scaleWeights = 1;
    } else if (headPosition.z < -80 && headPosition.z > -130) {
        scaleWeights = (headPosition.z + 130) / 50;
    } else if (headPosition.z > -25 && headPosition.z < -20) {
        scaleWeights = (-headPosition.z - 20) / 5;
    } else {
        scaleWeights = 0;
    }
    return scaleWeights;
}
