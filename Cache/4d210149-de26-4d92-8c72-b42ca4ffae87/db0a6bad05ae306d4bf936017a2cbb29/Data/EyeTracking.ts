import { blendAverage, degreesToRadians, expCos, normalizeEuler, radiansToDegrees } from '../Utils/MathUtills';
import { findNeutral, recalibrate } from '../Utils/Utills';
import { Landmark } from '../../Prefabs/Scripts/BitmojiFaceML';

export interface EyeOutputs {
    EyeUpLeftOutput: number,
    EyeUpRightOutput: number,
    EyeDownLeftOutput: number,
    EyeDownRightOutput: number,

    EyeOutRightOutput: number,
    EyeInLeftOutput: number,
    EyeOutLeftOutput: number,
    EyeInRightOutput: number
}

const EYE_LIMIT_DEGREES: vec3 = new vec3(30, 90, 50);

let leftEyeRotationXPrev: number = 0;
let rightEyeRotationXPrev: number = 0;

let midValueHorizontal: number = 0.5;
let defValueVertical: number = 0;
const eyeVerticalBuffer: number[] = [0];

const setEyeL: number[] = [];
const setEyeR: number[] = [];

let eyeUpLeftOutput: number = 0;
let eyeUpRightOutput: number = 0;
let eyeDownLeftOutput: number = 0;
let eyeDownRightOutput: number = 0;
let eyeInLeftOutput: number = 0;
let eyeInRightOutput: number = 0;
let eyeOutLeftOutput: number = 0;
let eyeOutRightOutput: number = 0;

let hasEyeTargetLeft: boolean = false,
    hasEyeTargetRight: boolean = false;

let eyeDummyLeft: SceneObject,
    eyeDummyRight: SceneObject,
    eyeTargetLeft: SceneObject,
    eyeTargetRight: SceneObject,
    eyeTargetLeftT: Transform,
    eyeTargetRightT: Transform;

let eyeLeftLookAt: LookAtComponent,
    eyeRightLookAt: LookAtComponent,
    eyeLeftLookAtT: Transform,
    eyeRightLookAtT: Transform;

export function getEyesOutputs(landmarksLocal: Landmark[], leftEyeT: Transform, rightEyeT: Transform,
    leftEyeJointT: Transform, rightEyeJointT: Transform, headRotation: vec3, smoothness: number,
    useBuffer: boolean, double_blink_start: number, wearingGlasses: boolean, outputWeights: number,
    headAway: number, set_eye_upDown: number[]): EyeOutputs {
    const eyeL = landmarksLocal[84];
    const eyeLOutput = landmarksLocal[45];
    const eyeLInput = landmarksLocal[42];

    const eyeR = landmarksLocal[75];
    const eyeROutput = landmarksLocal[36];
    const eyeRInput = landmarksLocal[39];

    const leftEyeRotation = leftEyeT.getLocalRotation().toEulerAngles();
    const rightEyeRotation = rightEyeT.getLocalRotation().toEulerAngles();
    const leftEyeWorldRotation = leftEyeT.getWorldRotation().toEulerAngles();

    const leftEyeRotationX = MathUtils.lerp(leftEyeRotationXPrev, normalizeEuler(leftEyeRotation.x), smoothness);
    const rightEyeRotationX = MathUtils.lerp(rightEyeRotationXPrev, normalizeEuler(rightEyeRotation.x), smoothness);
    leftEyeRotationXPrev = leftEyeRotationX;
    rightEyeRotationXPrev = rightEyeRotationX;

    const eyeRotationX = (normalizeEuler(leftEyeRotation.x) + normalizeEuler(rightEyeRotation.x)) / 2;
    const eyeRotationXRelative = normalizeEuler(eyeRotationX - headRotation.x);

    const eyeLRelativeX = MathUtils.remap(eyeL.x, eyeLInput.x, eyeLOutput.x, 0, 1);
    const eyeRRelativeX = MathUtils.remap(eyeR.x, eyeRInput.x, eyeROutput.x, 0, 1);

    if (useBuffer) {
        midValueHorizontal = findNeutral(eyeLRelativeX, setEyeL) / 2 + findNeutral(eyeRRelativeX, setEyeR) / 2;
        defValueVertical = eyeVerticalBuffer[0] = findNeutral(eyeRotationXRelative, set_eye_upDown);
    } else {
        //double blink
        const dbActiveTime = getTime() - double_blink_start;
        if (dbActiveTime < 1.5) {
            defValueVertical = eyeVerticalBuffer[0] = findNeutral(eyeRotationXRelative, set_eye_upDown);
        }
    }

    const eyeUpC = -1 * recalibrate(-4 * eyeRotationXRelative, -4 * defValueVertical, eyeVerticalBuffer);

    if (eyeLRelativeX - midValueHorizontal <= 0) {
        eyeInLeftOutput = Math.min(-6 * (eyeLRelativeX - midValueHorizontal), 1);
        eyeOutLeftOutput = 0;
    } else {
        eyeInLeftOutput = 0;
        eyeOutLeftOutput = Math.min(3 * (eyeLRelativeX - midValueHorizontal), 1);
    }

    if (eyeRRelativeX - midValueHorizontal <= 0) {
        eyeInRightOutput = Math.min(-6 * (eyeRRelativeX - midValueHorizontal), 1);
        eyeOutRightOutput = 0;
    } else {
        eyeInRightOutput = 0;
        eyeOutRightOutput = Math.min(3 * (eyeRRelativeX - midValueHorizontal), 1);
    }

    let blendOutputEyeL: number,
        blendOutputEyeR: number;

    if (wearingGlasses) {
        blendOutputEyeL = blendAverage((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 1.99, 2)[0];
        blendOutputEyeR = blendAverage((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 1.99, 2)[1];
    } else {
        blendOutputEyeL = blendAverage((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 0.4, 0.55)[0];
        blendOutputEyeR = blendAverage((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 0.4, 0.55)[1];
    }

    //vertical recalibrate
    if (eyeUpC >= 0) {
        eyeUpLeftOutput = 0;
        eyeUpRightOutput = 0;
        eyeDownLeftOutput = -expCos(Math.min((eyeUpC) * 2, 1), 2);
        eyeDownRightOutput = -expCos(Math.min((eyeUpC) * 2, 1), 2);
    } else {
        eyeUpLeftOutput = -expCos(Math.min((eyeUpC) * -2, 1), 2);
        eyeUpRightOutput = -expCos(Math.min((eyeUpC) * -2, 1), 2);
        eyeDownLeftOutput = 0;
        eyeDownRightOutput = 0;
    }

    const eyeLimitX = normalizeEuler(degreesToRadians(EYE_LIMIT_DEGREES.x));
    const eyeLimitY = normalizeEuler(degreesToRadians(EYE_LIMIT_DEGREES.y));
    const eyeUpDownLeft = (eyeUpLeftOutput - eyeDownLeftOutput) * 0.35 * (1 - headAway) * outputWeights;
    const eyeUpDownRight = (eyeUpRightOutput - eyeDownRightOutput) * 0.35 * (1 - headAway) * outputWeights;
    const eyeInOutLeft = blendOutputEyeL * -0.5 * (1 - headAway) * outputWeights;
    const eyeInOutRight = blendOutputEyeR * -0.5 * (1 - headAway) * outputWeights;

    const eyeHorizontalRange = Math.abs(radiansToDegrees(normalizeEuler(leftEyeWorldRotation.y)));
    const eyeVerticalRange = Math.abs(radiansToDegrees(normalizeEuler(leftEyeWorldRotation.x)));

    let eyeConstraintWeight: number;
    if (Math.max(eyeHorizontalRange, eyeVerticalRange) <= 8) {
        eyeConstraintWeight = 1;
    } else if (Math.max(eyeHorizontalRange, eyeVerticalRange) >= 18) {
        eyeConstraintWeight = 0;
    } else {
        eyeConstraintWeight = (18 - Math.max(eyeHorizontalRange, eyeVerticalRange)) / 10;
    }

    const currentEyeDistance = leftEyeT.getWorldPosition().distance(rightEyeT.getWorldPosition());

    if (!hasEyeTargetLeft) {
        eyeTargetLeftT.setLocalPosition(new vec3(currentEyeDistance / 2, 0, 0));
        hasEyeTargetLeft = true;
    }

    if (!hasEyeTargetRight) {
        eyeTargetRightT.setLocalPosition(new vec3(-currentEyeDistance / 2, 0, 0));
        hasEyeTargetRight = true;
    }

    const outputEyeL = eyeLeftLookAtT.getLocalRotation().toEulerAngles();
    const eyeJoint_LX = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeUpDownLeft) + eyeConstraintWeight * normalizeEuler(outputEyeL.x), - eyeLimitX, eyeLimitX);
    const eyeJoint_LY = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeInOutLeft) + eyeConstraintWeight * normalizeEuler(outputEyeL.y), -eyeLimitY, eyeLimitY);
    leftEyeJointT.setLocalRotation(quat.fromEulerVec(new vec3(eyeJoint_LX, eyeJoint_LY, 0)));

    //horizontal
    if (eyeJoint_LY <= 0) {
        eyeInLeftOutput = Math.min(-4 * eyeJoint_LY, 1);
        eyeOutLeftOutput = 0;
    } else {
        eyeInLeftOutput = 0;
        eyeOutLeftOutput = Math.min(2 * eyeJoint_LY, 1);
    }
    //vertical
    if (eyeJoint_LX <= 0) {
        eyeUpLeftOutput = 0;
        eyeDownLeftOutput = expCos(Math.min((eyeJoint_LX) * -2, 1), 2);
    } else {
        eyeUpLeftOutput = expCos(Math.min((eyeJoint_LX) * 2, 1), 2);
        eyeDownLeftOutput = 0;
    }

    const outputEyeR = eyeRightLookAtT.getLocalRotation().toEulerAngles();
    const eyeJointRightX = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeUpDownRight) + eyeConstraintWeight * normalizeEuler(outputEyeR.x), - eyeLimitX, eyeLimitX);
    const eyeJointRightY = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeInOutRight) + eyeConstraintWeight * normalizeEuler(outputEyeR.y), -eyeLimitY, eyeLimitY);
    rightEyeJointT.setLocalRotation(quat.fromEulerVec(new vec3(eyeJointRightX, eyeJointRightY, 0)));

    //horizontal
    if (eyeJointRightY >= 0) {
        eyeInRightOutput = Math.min(4 * eyeJointRightY, 1);
        eyeOutRightOutput = 0;
    } else {
        eyeInRightOutput = 0;
        eyeOutRightOutput = Math.min(-2 * eyeJointRightY, 1);
    }
    //vertical
    if (eyeJointRightX < 0) {
        eyeUpRightOutput = 0;
        eyeDownRightOutput = expCos(Math.min((eyeJointRightX) * -2, 1), 2);
    } else {
        eyeUpRightOutput = expCos(Math.min((eyeJointRightX) * 2, 1), 2);
        eyeDownRightOutput = 0;
    }

    return {
        EyeUpLeftOutput: eyeUpLeftOutput,
        EyeUpRightOutput: eyeUpRightOutput,
        EyeDownLeftOutput: eyeDownLeftOutput,
        EyeDownRightOutput: eyeDownRightOutput,

        EyeOutRightOutput: eyeOutRightOutput,
        EyeInLeftOutput: eyeInLeftOutput,
        EyeOutLeftOutput: eyeOutLeftOutput,
        EyeInRightOutput: eyeInRightOutput
    };
}

export function initializeEyeTargets(leftEyeSO: SceneObject, rightEyeSO: SceneObject, camera: SceneObject): void {
    eyeDummyLeft = global.scene.createSceneObject('eye_dummy_left');
    eyeDummyLeft.setParent(leftEyeSO.getParent());

    eyeDummyRight = global.scene.createSceneObject('eye_dummy_right');
    eyeDummyRight.setParent(rightEyeSO.getParent());

    eyeTargetLeft = global.scene.createSceneObject('eye_target_left');
    eyeTargetLeft.setParent(camera);
    eyeTargetLeftT = eyeTargetLeft.getTransform();

    eyeTargetRight = global.scene.createSceneObject('eye_target_right');
    eyeTargetRight.setParent(camera);
    eyeTargetRightT = eyeTargetRight.getTransform();

    eyeLeftLookAt = eyeDummyLeft.createComponent('Component.LookAtComponent') as LookAtComponent;
    eyeLeftLookAt.lookAtMode = LookAtComponent.LookAtMode.LookAtPoint;
    eyeLeftLookAt.target = eyeTargetLeft;
    eyeLeftLookAt.aimVectors = LookAtComponent.AimVectors.ZAimYUp;
    eyeLeftLookAtT = eyeLeftLookAt.getTransform();

    eyeRightLookAt = eyeDummyRight.createComponent('Component.LookAtComponent') as LookAtComponent;
    eyeRightLookAt.lookAtMode = LookAtComponent.LookAtMode.LookAtPoint;
    eyeRightLookAt.target = eyeTargetRight;
    eyeRightLookAt.aimVectors = LookAtComponent.AimVectors.ZAimYUp;
    eyeRightLookAtT = eyeRightLookAt.getTransform();
}
