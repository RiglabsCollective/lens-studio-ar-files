"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEyeTargets = exports.getEyesOutputs = void 0;
const MathUtills_1 = require("../Utils/MathUtills");
const Utills_1 = require("../Utils/Utills");
const EYE_LIMIT_DEGREES = new vec3(30, 90, 50);
let leftEyeRotationXPrev = 0;
let rightEyeRotationXPrev = 0;
let midValueHorizontal = 0.5;
let defValueVertical = 0;
const eyeVerticalBuffer = [0];
const setEyeL = [];
const setEyeR = [];
let eyeUpLeftOutput = 0;
let eyeUpRightOutput = 0;
let eyeDownLeftOutput = 0;
let eyeDownRightOutput = 0;
let eyeInLeftOutput = 0;
let eyeInRightOutput = 0;
let eyeOutLeftOutput = 0;
let eyeOutRightOutput = 0;
let hasEyeTargetLeft = false, hasEyeTargetRight = false;
let eyeDummyLeft, eyeDummyRight, eyeTargetLeft, eyeTargetRight, eyeTargetLeftT, eyeTargetRightT;
let eyeLeftLookAt, eyeRightLookAt, eyeLeftLookAtT, eyeRightLookAtT;
function getEyesOutputs(landmarksLocal, leftEyeT, rightEyeT, leftEyeJointT, rightEyeJointT, headRotation, smoothness, useBuffer, double_blink_start, wearingGlasses, outputWeights, headAway, set_eye_upDown) {
    const eyeL = landmarksLocal[84];
    const eyeLOutput = landmarksLocal[45];
    const eyeLInput = landmarksLocal[42];
    const eyeR = landmarksLocal[75];
    const eyeROutput = landmarksLocal[36];
    const eyeRInput = landmarksLocal[39];
    const leftEyeRotation = leftEyeT.getLocalRotation().toEulerAngles();
    const rightEyeRotation = rightEyeT.getLocalRotation().toEulerAngles();
    const leftEyeWorldRotation = leftEyeT.getWorldRotation().toEulerAngles();
    const leftEyeRotationX = MathUtils.lerp(leftEyeRotationXPrev, (0, MathUtills_1.normalizeEuler)(leftEyeRotation.x), smoothness);
    const rightEyeRotationX = MathUtils.lerp(rightEyeRotationXPrev, (0, MathUtills_1.normalizeEuler)(rightEyeRotation.x), smoothness);
    leftEyeRotationXPrev = leftEyeRotationX;
    rightEyeRotationXPrev = rightEyeRotationX;
    const eyeRotationX = ((0, MathUtills_1.normalizeEuler)(leftEyeRotation.x) + (0, MathUtills_1.normalizeEuler)(rightEyeRotation.x)) / 2;
    const eyeRotationXRelative = (0, MathUtills_1.normalizeEuler)(eyeRotationX - headRotation.x);
    const eyeLRelativeX = MathUtils.remap(eyeL.x, eyeLInput.x, eyeLOutput.x, 0, 1);
    const eyeRRelativeX = MathUtils.remap(eyeR.x, eyeRInput.x, eyeROutput.x, 0, 1);
    if (useBuffer) {
        midValueHorizontal = (0, Utills_1.findNeutral)(eyeLRelativeX, setEyeL) / 2 + (0, Utills_1.findNeutral)(eyeRRelativeX, setEyeR) / 2;
        defValueVertical = eyeVerticalBuffer[0] = (0, Utills_1.findNeutral)(eyeRotationXRelative, set_eye_upDown);
    }
    else {
        //double blink
        const dbActiveTime = getTime() - double_blink_start;
        if (dbActiveTime < 1.5) {
            defValueVertical = eyeVerticalBuffer[0] = (0, Utills_1.findNeutral)(eyeRotationXRelative, set_eye_upDown);
        }
    }
    const eyeUpC = -1 * (0, Utills_1.recalibrate)(-4 * eyeRotationXRelative, -4 * defValueVertical, eyeVerticalBuffer);
    if (eyeLRelativeX - midValueHorizontal <= 0) {
        eyeInLeftOutput = Math.min(-6 * (eyeLRelativeX - midValueHorizontal), 1);
        eyeOutLeftOutput = 0;
    }
    else {
        eyeInLeftOutput = 0;
        eyeOutLeftOutput = Math.min(3 * (eyeLRelativeX - midValueHorizontal), 1);
    }
    if (eyeRRelativeX - midValueHorizontal <= 0) {
        eyeInRightOutput = Math.min(-6 * (eyeRRelativeX - midValueHorizontal), 1);
        eyeOutRightOutput = 0;
    }
    else {
        eyeInRightOutput = 0;
        eyeOutRightOutput = Math.min(3 * (eyeRRelativeX - midValueHorizontal), 1);
    }
    let blendOutputEyeL, blendOutputEyeR;
    if (wearingGlasses) {
        blendOutputEyeL = (0, MathUtills_1.blendAverage)((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 1.99, 2)[0];
        blendOutputEyeR = (0, MathUtills_1.blendAverage)((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 1.99, 2)[1];
    }
    else {
        blendOutputEyeL = (0, MathUtills_1.blendAverage)((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 0.4, 0.55)[0];
        blendOutputEyeR = (0, MathUtills_1.blendAverage)((eyeInLeftOutput - eyeOutLeftOutput), (eyeOutRightOutput - eyeInRightOutput), 0.4, 0.55)[1];
    }
    //vertical recalibrate
    if (eyeUpC >= 0) {
        eyeUpLeftOutput = 0;
        eyeUpRightOutput = 0;
        eyeDownLeftOutput = -(0, MathUtills_1.expCos)(Math.min((eyeUpC) * 2, 1), 2);
        eyeDownRightOutput = -(0, MathUtills_1.expCos)(Math.min((eyeUpC) * 2, 1), 2);
    }
    else {
        eyeUpLeftOutput = -(0, MathUtills_1.expCos)(Math.min((eyeUpC) * -2, 1), 2);
        eyeUpRightOutput = -(0, MathUtills_1.expCos)(Math.min((eyeUpC) * -2, 1), 2);
        eyeDownLeftOutput = 0;
        eyeDownRightOutput = 0;
    }
    const eyeLimitX = (0, MathUtills_1.normalizeEuler)((0, MathUtills_1.degreesToRadians)(EYE_LIMIT_DEGREES.x));
    const eyeLimitY = (0, MathUtills_1.normalizeEuler)((0, MathUtills_1.degreesToRadians)(EYE_LIMIT_DEGREES.y));
    const eyeUpDownLeft = (eyeUpLeftOutput - eyeDownLeftOutput) * 0.35 * (1 - headAway) * outputWeights;
    const eyeUpDownRight = (eyeUpRightOutput - eyeDownRightOutput) * 0.35 * (1 - headAway) * outputWeights;
    const eyeInOutLeft = blendOutputEyeL * -0.5 * (1 - headAway) * outputWeights;
    const eyeInOutRight = blendOutputEyeR * -0.5 * (1 - headAway) * outputWeights;
    const eyeHorizontalRange = Math.abs((0, MathUtills_1.radiansToDegrees)((0, MathUtills_1.normalizeEuler)(leftEyeWorldRotation.y)));
    const eyeVerticalRange = Math.abs((0, MathUtills_1.radiansToDegrees)((0, MathUtills_1.normalizeEuler)(leftEyeWorldRotation.x)));
    let eyeConstraintWeight;
    if (Math.max(eyeHorizontalRange, eyeVerticalRange) <= 8) {
        eyeConstraintWeight = 1;
    }
    else if (Math.max(eyeHorizontalRange, eyeVerticalRange) >= 18) {
        eyeConstraintWeight = 0;
    }
    else {
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
    const eyeJoint_LX = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeUpDownLeft) + eyeConstraintWeight * (0, MathUtills_1.normalizeEuler)(outputEyeL.x), -eyeLimitX, eyeLimitX);
    const eyeJoint_LY = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeInOutLeft) + eyeConstraintWeight * (0, MathUtills_1.normalizeEuler)(outputEyeL.y), -eyeLimitY, eyeLimitY);
    leftEyeJointT.setLocalRotation(quat.fromEulerVec(new vec3(eyeJoint_LX, eyeJoint_LY, 0)));
    //horizontal
    if (eyeJoint_LY <= 0) {
        eyeInLeftOutput = Math.min(-4 * eyeJoint_LY, 1);
        eyeOutLeftOutput = 0;
    }
    else {
        eyeInLeftOutput = 0;
        eyeOutLeftOutput = Math.min(2 * eyeJoint_LY, 1);
    }
    //vertical
    if (eyeJoint_LX <= 0) {
        eyeUpLeftOutput = 0;
        eyeDownLeftOutput = (0, MathUtills_1.expCos)(Math.min((eyeJoint_LX) * -2, 1), 2);
    }
    else {
        eyeUpLeftOutput = (0, MathUtills_1.expCos)(Math.min((eyeJoint_LX) * 2, 1), 2);
        eyeDownLeftOutput = 0;
    }
    const outputEyeR = eyeRightLookAtT.getLocalRotation().toEulerAngles();
    const eyeJointRightX = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeUpDownRight) + eyeConstraintWeight * (0, MathUtills_1.normalizeEuler)(outputEyeR.x), -eyeLimitX, eyeLimitX);
    const eyeJointRightY = MathUtils.clamp((1 - eyeConstraintWeight) * (eyeInOutRight) + eyeConstraintWeight * (0, MathUtills_1.normalizeEuler)(outputEyeR.y), -eyeLimitY, eyeLimitY);
    rightEyeJointT.setLocalRotation(quat.fromEulerVec(new vec3(eyeJointRightX, eyeJointRightY, 0)));
    //horizontal
    if (eyeJointRightY >= 0) {
        eyeInRightOutput = Math.min(4 * eyeJointRightY, 1);
        eyeOutRightOutput = 0;
    }
    else {
        eyeInRightOutput = 0;
        eyeOutRightOutput = Math.min(-2 * eyeJointRightY, 1);
    }
    //vertical
    if (eyeJointRightX < 0) {
        eyeUpRightOutput = 0;
        eyeDownRightOutput = (0, MathUtills_1.expCos)(Math.min((eyeJointRightX) * -2, 1), 2);
    }
    else {
        eyeUpRightOutput = (0, MathUtills_1.expCos)(Math.min((eyeJointRightX) * 2, 1), 2);
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
exports.getEyesOutputs = getEyesOutputs;
function initializeEyeTargets(leftEyeSO, rightEyeSO, camera) {
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
    eyeLeftLookAt = eyeDummyLeft.createComponent('Component.LookAtComponent');
    eyeLeftLookAt.lookAtMode = LookAtComponent.LookAtMode.LookAtPoint;
    eyeLeftLookAt.target = eyeTargetLeft;
    eyeLeftLookAt.aimVectors = LookAtComponent.AimVectors.ZAimYUp;
    eyeLeftLookAtT = eyeLeftLookAt.getTransform();
    eyeRightLookAt = eyeDummyRight.createComponent('Component.LookAtComponent');
    eyeRightLookAt.lookAtMode = LookAtComponent.LookAtMode.LookAtPoint;
    eyeRightLookAt.target = eyeTargetRight;
    eyeRightLookAt.aimVectors = LookAtComponent.AimVectors.ZAimYUp;
    eyeRightLookAtT = eyeRightLookAt.getTransform();
}
exports.initializeEyeTargets = initializeEyeTargets;
//# sourceMappingURL=EyeTracking.js.map