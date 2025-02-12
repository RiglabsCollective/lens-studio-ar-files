"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpressions = exports.isTongueOpen = exports.updateJaw = exports.initializeTongue = void 0;
const Utills_1 = require("../Utils/Utills");
const MathUtills_1 = require("../Utils/MathUtills");
const ExpressionsCalculation_1 = require("./ExpressionsCalculation");
const expressions = {
    BrowsDownLeft: 0,
    BrowsDownRight: 0,
    BrowsUpCenter: 0,
    BrowsUpLeft: 0,
    BrowsUpRight: 0,
    EyeBlinkLeft: 0,
    EyeBlinkRight: 0,
    EyeOpenLeft: 0,
    EyeOpenRight: 0,
    EyeSquintLeft: 0,
    EyeSquintRight: 0,
    JawOpen: 0,
    JawLeft: 0,
    JawRight: 0,
    LipsFunnel: 0,
    LipsPucker: 0,
    LowerLipClose: 0,
    LowerLipDownLeft: 0,
    LowerLipDownRight: 0,
    LowerLipRaise: 0,
    UpperLipClose: 0,
    UpperLipUpLeft: 0,
    UpperLipUpRight: 0,
    MouthClose: 0,
    MouthLeft: 0,
    MouthRight: 0,
    MouthSmileLeft: 0,
    MouthSmileRight: 0,
    MouthStretchLeft: 0,
    MouthStretchRight: 0,
    Puff: 0,
    SneerLeft: 0,
    SneerRight: 0
};
const outputs = {
    'ai_browDown_L': 0,
    'ai_browDown_R': 0,
    'ai_browInnerDn_L': 0,
    'ai_browInnerDn_R': 0,
    'ai_browInnerIn_L': 0,
    'ai_browInnerIn_R': 0,
    'ai_browInnerUp_L': 0,
    'ai_browInnerUp_R': 0,
    'ai_browMidDown_L': 0,
    'ai_browMidDown_R': 0,
    'ai_browMidUp_L': 0,
    'ai_browMidUp_R': 0,
    'ai_browOuterUp_L': 0,
    'ai_browOuterUp_R': 0,
    'ai_browUp_L': 0,
    'ai_browUp_R': 0,
    'ai_cheekPuff_L': 0,
    'ai_cheekPuff_R': 0,
    'ai_cheekSquint_L': 0,
    'ai_cheekSquint_R': 0,
    'ai_lipLowerUp_C': 0,
    'ai_lipLowerUp_L': 0,
    'ai_lipLowerUp_R': 0,
    'ai_lipLowerWide_L': 0,
    'ai_lipLowerWide_R': 0,
    'ai_lipLower_C': 0,
    'ai_lipLower_L': 0,
    'ai_lipLower_R': 0,
    'ai_lipUpperDown_C': 0,
    'ai_lipUpperDown_L': 0,
    'ai_lipUpperDown_R': 0,
    'ai_lipUpperWide_L': 0,
    'ai_lipUpperWide_R': 0,
    'ai_lipUpper_C': 0,
    'ai_lipUpper_L': 0,
    'ai_lipUpper_R': 0,
    'ai_mouthDimple_L': 0,
    'ai_mouthDimple_R': 0,
    'ai_mouthDn': 0,
    'ai_mouthFrown_L': 0,
    'ai_mouthFrown_R': 0,
    'ai_mouthIn_L': 0,
    'ai_mouthIn_R': 0,
    'ai_mouthLeft': 0,
    'ai_mouthOut': 0,
    'ai_mouthRight': 0,
    'ai_mouthRollLower': 0,
    'ai_mouthRollUpper': 0,
    'ai_mouthShrugLower': 0,
    'ai_mouthShrugUpper': 0,
    'ai_mouthSmile_L': 0,
    'ai_mouthSmile_R': 0,
    'ai_mouthStretch_L': 0,
    'ai_mouthStretch_R': 0,
    'ai_mouthUp': 0,
    'ai_mouthUpperDown': 0,
    'ai_neutral': 0,
    'ai_noseSneer_L': 0,
    'ai_noseSneer_R': 0,
    'ca_lipCornerPinch_L': 0,
    'ca_lipCornerPinch_R': 0,
    'ca_lipCornerRound_L': 0,
    'ca_lipCornerRound_R': 0,
    'ca_lipCornerSmile_L': 0,
    'ca_lipCornerSmile_R': 0,
    'ai_eyeInUpperClose_L': 0,
    'ai_eyeInUpperClose_R': 0,
    'ai_eyeIrisDown_L': 0,
    'ai_eyeIrisDown_R': 0,
    'ai_eyeIrisIn_L': 0,
    'ai_eyeIrisIn_R': 0,
    'ai_eyeIrisOut_L': 0,
    'ai_eyeIrisOut_R': 0,
    'ai_eyeIrisUp_L': 0,
    'ai_eyeIrisUp_R': 0,
    'ai_eyeLowerClose_25_L': 0,
    'ai_eyeLowerClose_25_R': 0,
    'ai_eyeLowerClose_50_L': 0,
    'ai_eyeLowerClose_50_R': 0,
    'ai_eyeLowerClose_75_L': 0,
    'ai_eyeLowerClose_75_R': 0,
    'ai_eyeLowerClose_L': 0,
    'ai_eyeLowerClose_R': 0,
    'ai_eyeLowerSmile_L': 0,
    'ai_eyeLowerSmile_R': 0,
    'ai_eyeLowerWide_L': 0,
    'ai_eyeLowerWide_R': 0,
    'ai_eyeOutUpperClose_L': 0,
    'ai_eyeOutUpperClose_R': 0,
    'ai_eyeUpperClose_25_L': 0,
    'ai_eyeUpperClose_25_R': 0,
    'ai_eyeUpperClose_50_L': 0,
    'ai_eyeUpperClose_50_R': 0,
    'ai_eyeUpperClose_75_L': 0,
    'ai_eyeUpperClose_75_R': 0,
    'ai_eyeUpperClose_L': 0,
    'ai_eyeUpperClose_R': 0,
    'ai_eyeUpperWide_L': 0,
    'ai_eyeUpperWide_R': 0
};
const browsUpCenterBuffer = [0];
const browsUpLeftBuffer = [0];
const browsUpRightBuffer = [0];
const browsDownLeftBuffer = [0];
const browsDownRightBuffer = [0];
const puffBuffer = [0];
const browsUpCenterSet = [];
const browsUpLeftSet = [];
const browsUpRightSet = [];
const browsDownLeftSet = [];
const browsDownRightSet = [];
const puffSet = [];
const minBuffer = [0.7];
const maxBuffer = [0.3];
let browsUpCenter_r = 0;
let browsUpLeft_r = 0;
let browsUpRight_r = 0;
let browsDownLeft_r = 0;
let browsDownRight_r = 0;
let puff_r;
let jawOpenOutput;
let bitmojiTongueOutOutput;
let lipsFunnelOutput;
let lipsPuckerOutput;
let mouthCloseOutput;
let tongue01T;
let tongue02T;
let tongue03T;
let tongue04T;
let tongue01Position;
let tongue02Position;
let tongue03Position;
let tongue04Position;
let tongue01Rotation;
let tongue02Rotation;
let tongue03Rotation;
let tongue04Rotation;
let tongue001Position;
let tongue001Rotation;
let tongue002Position;
let tongue002Rotation;
let tongue003Position;
let tongue003Rotation;
let tongue004Position;
let tongue004Rotation;
function initializeTongue(tongue001, tongue002, tongue003, tongue004) {
    tongue01T = tongue001.getTransform();
    tongue02T = tongue002.getTransform();
    tongue03T = tongue003.getTransform();
    tongue04T = tongue004.getTransform();
    tongue01Position = tongue001.getTransform().getLocalPosition();
    tongue02Position = tongue002.getTransform().getLocalPosition();
    tongue03Position = tongue003.getTransform().getLocalPosition();
    tongue04Position = tongue004.getTransform().getLocalPosition();
    tongue01Rotation = tongue001.getTransform().getLocalRotation();
    tongue02Rotation = tongue002.getTransform().getLocalRotation();
    tongue03Rotation = tongue003.getTransform().getLocalRotation();
    tongue04Rotation = tongue004.getTransform().getLocalRotation();
    tongue001Position = tongue01T.getLocalPosition();
    tongue002Position = tongue02T.getLocalPosition();
    tongue002Rotation = tongue02T.getLocalRotation().toEulerAngles();
    tongue003Position = tongue03T.getLocalPosition();
    tongue003Rotation = tongue03T.getLocalRotation();
    tongue004Position = tongue04T.getLocalPosition();
    tongue004Rotation = tongue04T.getLocalRotation();
}
exports.initializeTongue = initializeTongue;
function updateJaw(jawJointT) {
    const jawRot_x = jawOpenOutput * 23.3;
    jawJointT.setLocalRotation(quat.fromEulerVec(new vec3((0, MathUtills_1.degreesToRadians)(-60 + jawRot_x), 0, (0, MathUtills_1.degreesToRadians)(90))));
}
exports.updateJaw = updateJaw;
function isTongueOpen(outputWeights) {
    if (outputWeights >= 0.5) {
        tongue01T.setLocalPosition(new vec3(tongue001Position.x, tongue001Position.y + bitmojiTongueOutOutput * outputWeights * 0.04, tongue001Position.z - bitmojiTongueOutOutput * outputWeights * 0.05));
        tongue02T.setLocalPosition(new vec3(tongue002Position.x + bitmojiTongueOutOutput * outputWeights * 0.02, tongue002Position.y - bitmojiTongueOutOutput * outputWeights * 0.01, tongue002Position.z));
        tongue02T.setLocalRotation(quat.fromEulerAngles(tongue002Rotation.x, tongue002Rotation.y - 1.5 * bitmojiTongueOutOutput * MathUtils.DegToRad * outputWeights, tongue002Rotation.z));
    }
    if (bitmojiTongueOutOutput >= 0.8 && jawOpenOutput >= 0.6) {
        tongue01Position = tongue01T.getLocalPosition();
        tongue02Position = tongue02T.getLocalPosition();
        tongue03Position = tongue03T.getLocalPosition();
        tongue04Position = tongue04T.getLocalPosition();
        tongue01Rotation = tongue01T.getLocalRotation();
        tongue02Rotation = tongue02T.getLocalRotation();
        tongue03Rotation = tongue03T.getLocalRotation();
        tongue04Rotation = tongue04T.getLocalRotation();
        return true;
    }
    else {
        tongue03T.setLocalPosition(vec3.slerp(tongue03Position, tongue003Position, (Math.min(5 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        tongue03T.setLocalRotation(quat.slerp(tongue03Rotation, tongue003Rotation, (Math.min(5 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        tongue04T.setLocalPosition(vec3.slerp(tongue04Position, tongue004Position, (5 * Math.min(1 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        tongue04T.setLocalRotation(quat.slerp(tongue04Rotation, tongue004Rotation, (5 * Math.min(1 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        return false;
    }
}
exports.isTongueOpen = isTongueOpen;
function updateExpressions(mlOutputData, tongueSize, smoothness, frown, headRotation, outputWeights, useBuffer, eyeOutputs) {
    lerpExpressions(mlOutputData, smoothness);
    if (useBuffer) {
        browsUpCenter_r = browsUpCenterBuffer[0] = (0, Utills_1.findNeutral)(expressions.BrowsUpCenter, browsUpCenterSet);
        browsUpLeft_r = browsUpLeftBuffer[0] = (0, Utills_1.findNeutral)(expressions.BrowsUpLeft, browsUpLeftSet);
        browsUpRight_r = browsUpRightBuffer[0] = (0, Utills_1.findNeutral)(expressions.BrowsUpRight, browsUpRightSet);
        browsDownLeft_r = browsDownLeftBuffer[0] = (0, Utills_1.findNeutral)(expressions.BrowsDownLeft, browsDownLeftSet);
        browsDownRight_r = browsDownRightBuffer[0] = (0, Utills_1.findNeutral)(expressions.BrowsDownRight, browsDownRightSet);
        puff_r = puffBuffer[0] = (0, Utills_1.findNeutral)(expressions.Puff, puffSet);
    }
    const browsUpCenterCalibrated = (0, Utills_1.recalibrate)(expressions.BrowsUpCenter, browsUpCenter_r, browsUpCenterBuffer);
    const browsUpLeftCalibrated = (0, Utills_1.recalibrate)(expressions.BrowsUpLeft, browsUpLeft_r, browsUpLeftBuffer);
    const browsUpRightCalibrated = (0, Utills_1.recalibrate)(expressions.BrowsUpRight, browsUpRight_r, browsUpRightBuffer);
    const browsDownLeftCalibrated = (0, Utills_1.recalibrate)(expressions.BrowsDownLeft, browsDownLeft_r, browsDownLeftBuffer);
    const browsDownRightCalibrated = (0, Utills_1.recalibrate)(expressions.BrowsDownRight, browsDownRight_r, browsDownRightBuffer);
    const puffCalibrated = (0, Utills_1.recalibrate)(expressions.Puff, puff_r, puffBuffer);
    const puffNormalized = (0, Utills_1.scaleNormalizer)(expressions.Puff, minBuffer, maxBuffer);
    const lipsFunnelPuckerCalibrated = Math.max(Math.max(expressions.LipsFunnel, expressions.LipsPucker) - 0.1, 0);
    const mouthStretchAvg = expressions.MouthStretchLeft / 2 + expressions.MouthStretchRight / 2;
    // Usage
    const bitmojiBrowDownCenterOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBitmojiBrowDownCenterOutput(browsDownLeftCalibrated, browsDownRightCalibrated);
    const browsDownLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBrowsDownLeftOutput(browsDownLeftCalibrated);
    const browsDownRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBrowsDownRightOutput(browsDownRightCalibrated);
    const browsUpCenterOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBrowsUpCenterOutput(browsUpCenterCalibrated);
    const browsUpLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBrowsUpLeftOutput(browsUpLeftCalibrated);
    const browsUpRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBrowsUpRightOutput(browsUpRightCalibrated);
    const eyeBlinkLeftCalibrated = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeBlinkLeftCalibrated(expressions);
    const eyeBlinkRightCalibrated = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeBlinkRightCalibrated(expressions);
    const cheekSquintLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateCheekSquintLeftOutput(expressions, eyeBlinkLeftCalibrated);
    const cheekSquintRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateCheekSquintRightOutput(expressions, eyeBlinkRightCalibrated);
    const eyeOpenLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeOpenLeftOutput(expressions, eyeBlinkLeftCalibrated);
    const eyeOpenRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeOpenRightOutput(expressions, eyeBlinkRightCalibrated);
    const eyeSquintLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeSquintLeftOutput(expressions, eyeBlinkLeftCalibrated);
    const eyeSquintRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeSquintRightOutput(expressions, eyeBlinkRightCalibrated);
    jawOpenOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateJawOpenOutput(expressions);
    bitmojiTongueOutOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBitmojiTongueOutOutput(jawOpenOutput, tongueSize);
    lipsFunnelOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateLipsFunnelOutput(lipsFunnelPuckerCalibrated, expressions);
    const lipsPuckerCalibrated = ExpressionsCalculation_1.ExpressionsCalculation.calculateLipsPuckerCalibrated(lipsFunnelPuckerCalibrated, expressions, mouthStretchAvg, frown, lipsFunnelOutput);
    lipsPuckerOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateLipsPuckerOutput(lipsPuckerCalibrated);
    const lowerLipCloseOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateLowerLipCloseOutput(expressions, frown, headRotation);
    const lowerLipDownLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateLowerLipDownLeftOutput(expressions, bitmojiTongueOutOutput, lipsFunnelOutput);
    const lowerLipDownRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateLowerLipDownRightOutput(expressions, bitmojiTongueOutOutput, lipsFunnelOutput);
    const lowerLipRaiseOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateLowerLipRaiseOutput(expressions, frown);
    const upperLipCloseOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateUpperLipCloseOutput(expressions, frown, headRotation);
    const upperLipUpLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateUpperLipUpLeftOutput(expressions, browsDownLeftCalibrated, browsDownRightCalibrated, lipsFunnelOutput, lipsPuckerOutput);
    const upperLipUpRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateUpperLipUpRightOutput(expressions, browsDownLeftCalibrated, browsDownRightCalibrated, lipsFunnelOutput, lipsPuckerOutput);
    const upperLipRaiseOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateUpperLipRaiseOutput(expressions, frown);
    const mouthDimpleLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthDimpleLeftOutput(expressions);
    const mouthDimpleRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthDimpleRightOutput(expressions);
    const mouthFrownLeftCalibrated = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthFrownLeftCalibrated(expressions, mouthStretchAvg, frown);
    const mouthFrownRightCalibrated = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthFrownRightCalibrated(expressions, mouthStretchAvg, frown);
    const mouthFrownLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthFrownLeftOutput(mouthFrownLeftCalibrated, mouthFrownRightCalibrated);
    const mouthFrownRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthFrownRightOutput(mouthFrownRightCalibrated, mouthFrownLeftCalibrated);
    const mouthLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthLeftOutput(expressions);
    const mouthRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthRightOutput(expressions);
    const mouthSmileLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthSmileLeftOutput(expressions, frown);
    const mouthSmileRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthSmileRightOutput(expressions, frown);
    const mouthStretchLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthStretchLeftOutput();
    const mouthStretchRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthStretchRightOutput();
    const mouthUpLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthUpLeftOutput(mouthLeftOutput);
    const mouthUpRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateMouthUpRightOutput(mouthRightOutput);
    const puffOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculatePuffOutput(expressions, lipsFunnelOutput, lipsPuckerCalibrated, mouthLeftOutput, mouthRightOutput, puffCalibrated, puffNormalized, MathUtills_1.average, jawOpenOutput, mouthCloseOutput);
    const sneerLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateSneerLeftOutput(expressions);
    const sneerRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateSneerRightOutput(expressions);
    const bInput = ExpressionsCalculation_1.ExpressionsCalculation.calculateBInput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, mouthSmileLeftOutput, mouthSmileRightOutput);
    const bitmojiBlinkHappyCalibrated = ExpressionsCalculation_1.ExpressionsCalculation.calculateBitmojiBlinkHappyCalibrated(bInput);
    const eyeBlinkLeftOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeBlinkLeftOutput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, bitmojiBlinkHappyCalibrated);
    const eyeBlinkRightOutput = ExpressionsCalculation_1.ExpressionsCalculation.calculateEyeBlinkRightOutput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, bitmojiBlinkHappyCalibrated);
    //brow
    outputs['ai_browInnerDn_L'] = 0.5 * bitmojiBrowDownCenterOutput * outputWeights;
    outputs['ai_browInnerDn_R'] = 0.5 * bitmojiBrowDownCenterOutput * outputWeights;
    //eye L
    outputs['ai_eyeUpperClose_50_L'] = eyeBlinkLeftOutput * outputWeights;
    outputs['ai_eyeLowerClose_50_L'] = eyeBlinkLeftOutput * outputWeights;
    outputs['ai_eyeIrisDown_L'] = Math.max((1 - eyeBlinkLeftOutput), 0) * eyeOutputs.EyeDownLeftOutput * outputWeights;
    outputs['ai_eyeIrisIn_L'] = Math.max((1 - eyeBlinkLeftOutput), 0) * eyeOutputs.EyeInLeftOutput * outputWeights;
    outputs['ai_eyeIrisOut_L'] = Math.max((1 - eyeBlinkLeftOutput), 0) * eyeOutputs.EyeOutLeftOutput * outputWeights;
    outputs['ai_eyeIrisUp_L'] = Math.max((1 - eyeBlinkLeftOutput), 0) * eyeOutputs.EyeUpLeftOutput * outputWeights;
    outputs['ai_eyeLowerSmile_L'] = Math.max((1 - eyeBlinkLeftOutput), 0) * (eyeSquintLeftOutput + 0.5 * mouthSmileLeftOutput) * outputWeights;
    outputs['ai_eyeUpperWide_L'] = eyeOpenLeftOutput * outputWeights;
    outputs['ai_eyeLowerWide_L'] = eyeOpenLeftOutput * outputWeights;
    //eye R
    outputs['ai_eyeUpperClose_50_R'] = eyeBlinkRightOutput * outputWeights;
    outputs['ai_eyeLowerClose_50_R'] = eyeBlinkRightOutput * outputWeights;
    outputs['ai_eyeIrisDown_R'] = Math.max((1 - 2 * eyeBlinkRightOutput), 0) * eyeOutputs.EyeDownRightOutput * outputWeights;
    outputs['ai_eyeIrisIn_R'] = Math.max((1 - 2 * eyeBlinkRightOutput), 0) * eyeOutputs.EyeInRightOutput * outputWeights;
    outputs['ai_eyeIrisOut_R'] = Math.max((1 - 2 * eyeBlinkRightOutput), 0) * eyeOutputs.EyeOutRightOutput * outputWeights;
    outputs['ai_eyeIrisUp_R'] = Math.max((1 - 2 * eyeBlinkRightOutput), 0) * eyeOutputs.EyeUpRightOutput * outputWeights;
    outputs['ai_eyeLowerSmile_R'] = Math.max((1 - 2 * eyeBlinkRightOutput), 0) * (eyeSquintRightOutput + 0.5 * mouthSmileRightOutput) * outputWeights;
    outputs['ai_eyeUpperWide_R'] = eyeOpenRightOutput * outputWeights;
    outputs['ai_eyeLowerWide_R'] = eyeOpenRightOutput * outputWeights;
    //mouth
    outputs['ai_mouthIn_L'] = 0.5 * lipsFunnelOutput + 0.5 * lipsPuckerOutput * outputWeights;
    outputs['ai_mouthIn_R'] = 0.5 * lipsFunnelOutput + 0.5 * lipsPuckerOutput * outputWeights;
    outputs['ai_lipLower_C'] = 0.5 * lipsFunnelOutput + 0.1 * lowerLipDownLeftOutput + 0.1 * lowerLipDownRightOutput * outputWeights + 0.1 * bitmojiTongueOutOutput * outputWeights;
    outputs['ai_lipUpper_C'] = 0.5 * lipsFunnelOutput + 0.1 * upperLipUpLeftOutput + 0.1 * upperLipUpRightOutput * outputWeights;
    outputs['ai_mouthOut'] = 0.5 * lipsPuckerOutput + 0.5 * lipsFunnelOutput + 0.1 * mouthSmileLeftOutput + 0.1 * mouthSmileRightOutput * outputWeights;
    outputs['ai_mouthLeft'] = mouthLeftOutput * outputWeights;
    outputs['ai_mouthRight'] = mouthRightOutput * outputWeights;
    outputs['ai_mouthSmile_L'] = 0.9 * mouthSmileLeftOutput * outputWeights;
    outputs['ai_mouthSmile_R'] = 0.9 * mouthSmileRightOutput * outputWeights;
    outputs['ai_mouthFrown_L'] = 0.25 * mouthFrownLeftOutput * outputWeights;
    outputs['ai_mouthFrown_R'] = 0.25 * mouthFrownRightOutput * outputWeights;
    outputs['ai_mouthDimple_L'] = 0.5 * mouthDimpleLeftOutput * outputWeights;
    outputs['ai_mouthDimple_R'] = 0.5 * mouthDimpleRightOutput * outputWeights;
    outputs['ai_mouthStretch_L'] = 0.5 * mouthStretchLeftOutput * outputWeights;
    outputs['ai_mouthStretch_R'] = 0.5 * mouthStretchRightOutput * outputWeights;
    //lip
    outputs['ai_mouthRollLower'] = lowerLipCloseOutput * outputWeights;
    outputs['ai_mouthRollUpper'] = upperLipCloseOutput * outputWeights + mouthCloseOutput * 0.333;
    outputs['ai_mouthShrugLower'] = 0.4 * lowerLipRaiseOutput * outputWeights;
    outputs['ai_mouthShrugUpper'] = 0.4 * upperLipRaiseOutput * outputWeights;
    outputs['ca_lipCornerSmile_L'] = 0.3 * mouthUpLeftOutput * outputWeights;
    outputs['ca_lipCornerSmile_R'] = 0.3 * mouthUpRightOutput * outputWeights;
    outputs['ai_lipLower_L'] = 0.25 * lowerLipDownLeftOutput * outputWeights + 0.3 * bitmojiTongueOutOutput * outputWeights;
    outputs['ai_lipLower_R'] = 0.25 * lowerLipDownRightOutput * outputWeights + 0.3 * bitmojiTongueOutOutput * outputWeights;
    outputs['ai_lipUpper_L'] = 0.2 * upperLipUpLeftOutput * outputWeights;
    outputs['ai_lipUpper_R'] = 0.2 * upperLipUpRightOutput * outputWeights;
    //brows
    outputs['ai_browDown_L'] = browsDownLeftOutput * outputWeights;
    outputs['ai_browDown_R'] = browsDownRightOutput * outputWeights;
    outputs['ai_browInnerUp_L'] = 0.75 * browsUpCenterOutput * outputWeights;
    outputs['ai_browInnerUp_R'] = 0.75 * browsUpCenterOutput * outputWeights;
    outputs['ai_browOuterUp_L'] = browsUpLeftOutput * outputWeights;
    outputs['ai_browOuterUp_R'] = browsUpRightOutput * outputWeights;
    outputs['ai_browMidUp_L'] = 0.5 * browsUpCenterOutput + 0.5 * browsUpLeftOutput * outputWeights;
    outputs['ai_browMidUp_R'] = 0.5 * browsUpCenterOutput + 0.5 * browsUpRightOutput * outputWeights;
    //cheek
    outputs['ai_cheekPuff_L'] = 0.75 * puffOutput * outputWeights;
    outputs['ai_cheekPuff_R'] = 0.75 * puffOutput * outputWeights;
    outputs['ai_cheekSquint_L'] = 0.2 * cheekSquintLeftOutput * outputWeights;
    outputs['ai_cheekSquint_R'] = 0.2 * cheekSquintRightOutput * outputWeights;
    outputs['ai_noseSneer_L'] = 0.6 * sneerLeftOutput * outputWeights;
    outputs['ai_noseSneer_R'] = 0.6 * sneerRightOutput * outputWeights;
    outputs['ai_lipLowerWide_L'] = bitmojiTongueOutOutput * outputWeights;
    outputs['ai_lipLowerWide_R'] = bitmojiTongueOutOutput * outputWeights;
    //correctives shapes
    outputs['ai_mouthClose'] = mouthCloseOutput / 3 * outputWeights;
    outputs['ai_lipLowerUp_L'] = mouthCloseOutput * 0.667;
    outputs['ai_lipLowerUp_R'] = mouthCloseOutput * 0.667;
    outputs['ai_lipUpperDown_L'] = 0.9 * mouthCloseOutput * 0.333 + 0.2 * mouthSmileLeftOutput;
    outputs['ai_lipUpperDown_R'] = 0.9 * mouthCloseOutput * 0.333 + 0.2 * mouthSmileRightOutput;
    outputs['ai_lipUpperDown_C'] = mouthCloseOutput * 0.667;
    outputs['ai_lipLowerUp_C'] = mouthCloseOutput * 0.667;
    return outputs;
}
exports.updateExpressions = updateExpressions;
function lerpExpressions(mlOutputData, smoothness) {
    expressions.BrowsDownLeft = MathUtils.lerp(expressions.BrowsDownLeft, mlOutputData[14], smoothness);
    expressions.BrowsDownRight = MathUtils.lerp(expressions.BrowsDownRight, mlOutputData[15], smoothness);
    expressions.BrowsUpCenter = MathUtils.lerp(expressions.BrowsUpCenter, mlOutputData[16], smoothness);
    expressions.BrowsUpLeft = MathUtils.lerp(expressions.BrowsUpLeft, mlOutputData[17], smoothness);
    expressions.BrowsUpRight = MathUtils.lerp(expressions.BrowsUpRight, mlOutputData[18], smoothness);
    expressions.EyeBlinkLeft = MathUtils.lerp(expressions.EyeBlinkLeft, mlOutputData[0], smoothness);
    expressions.EyeBlinkRight = MathUtils.lerp(expressions.EyeBlinkRight, mlOutputData[1], smoothness);
    expressions.EyeOpenLeft = MathUtils.lerp(expressions.EyeOpenLeft, mlOutputData[8], smoothness);
    expressions.EyeOpenRight = MathUtils.lerp(expressions.EyeOpenRight, mlOutputData[9], smoothness);
    expressions.EyeSquintLeft = MathUtils.lerp(expressions.EyeSquintLeft, mlOutputData[2], smoothness);
    expressions.EyeSquintRight = MathUtils.lerp(expressions.EyeSquintRight, mlOutputData[3], smoothness);
    expressions.JawOpen = MathUtils.lerp(expressions.JawOpen, mlOutputData[21], smoothness);
    expressions.JawLeft = MathUtils.lerp(expressions.JawLeft, mlOutputData[20], smoothness);
    expressions.JawRight = MathUtils.lerp(expressions.JawRight, mlOutputData[22], smoothness);
    expressions.LipsFunnel = MathUtils.lerp(expressions.LipsFunnel, mlOutputData[39], smoothness);
    expressions.LipsPucker = MathUtils.lerp(expressions.LipsPucker, mlOutputData[40], smoothness);
    expressions.LowerLipClose = MathUtils.lerp(expressions.LowerLipClose, mlOutputData[34], smoothness);
    expressions.LowerLipDownLeft = MathUtils.lerp(expressions.LowerLipDownLeft, mlOutputData[37], smoothness);
    expressions.LowerLipDownRight = MathUtils.lerp(expressions.LowerLipDownRight, mlOutputData[38], smoothness);
    expressions.LowerLipRaise = MathUtils.lerp(expressions.LowerLipRaise, mlOutputData[41], smoothness);
    expressions.UpperLipClose = MathUtils.lerp(expressions.UpperLipClose, mlOutputData[33], smoothness);
    expressions.UpperLipUpLeft = MathUtils.lerp(expressions.UpperLipUpLeft, mlOutputData[35], smoothness);
    expressions.UpperLipUpRight = MathUtils.lerp(expressions.UpperLipUpRight, mlOutputData[36], smoothness);
    expressions.MouthClose = MathUtils.lerp(expressions.MouthClose, mlOutputData[50], smoothness);
    expressions.MouthLeft = MathUtils.lerp(expressions.MouthLeft, mlOutputData[23], smoothness);
    expressions.MouthRight = MathUtils.lerp(expressions.MouthRight, mlOutputData[24], smoothness);
    expressions.MouthSmileLeft = MathUtils.lerp(expressions.MouthSmileLeft, mlOutputData[27], smoothness);
    expressions.MouthSmileRight = MathUtils.lerp(expressions.MouthSmileRight, mlOutputData[28], smoothness);
    expressions.MouthStretchLeft = MathUtils.lerp(expressions.MouthStretchLeft, mlOutputData[48], smoothness);
    expressions.MouthStretchRight = MathUtils.lerp(expressions.MouthStretchRight, mlOutputData[49], smoothness);
    expressions.Puff = MathUtils.lerp(expressions.Puff, mlOutputData[43], smoothness);
    expressions.SneerLeft = MathUtils.lerp(expressions.SneerLeft, mlOutputData[46], smoothness);
    expressions.SneerRight = MathUtils.lerp(expressions.SneerRight, mlOutputData[47], smoothness);
}
//# sourceMappingURL=Expressions.js.map