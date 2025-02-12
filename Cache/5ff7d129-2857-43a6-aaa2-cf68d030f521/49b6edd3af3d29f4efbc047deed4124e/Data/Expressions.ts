import { findNeutral, recalibrate, scaleNormalizer } from '../Utils/Utills';
import { average, balloon, blendAverage, degreesToRadians, expCos, normalizeEuler } from '../Utils/MathUtills';
import { EyeOutputs } from './EyeTracking';
import {
    ExpressionsCalculation
} from './ExpressionsCalculation';

export interface BitmojiExpressions {
    BrowsDownLeft: number,
    BrowsDownRight: number,
    BrowsUpCenter: number,
    BrowsUpLeft: number,
    BrowsUpRight: number,
    EyeBlinkLeft: number,
    EyeBlinkRight: number,
    EyeOpenLeft: number,
    EyeOpenRight: number,
    EyeSquintLeft: number,
    EyeSquintRight: number,
    JawOpen: number,
    JawLeft: number,
    JawRight: number,
    LipsFunnel: number,
    LipsPucker: number,
    LowerLipClose: number,
    LowerLipDownLeft: number,
    LowerLipDownRight: number,
    LowerLipRaise: number,
    UpperLipClose: number,
    UpperLipUpLeft: number,
    UpperLipUpRight: number,
    MouthClose: number,
    MouthLeft: number,
    MouthRight: number,
    MouthSmileLeft: number,
    MouthSmileRight: number,
    MouthStretchLeft: number,
    MouthStretchRight: number,
    Puff: number,
    SneerLeft: number,
    SneerRight: number
}

const expressions: BitmojiExpressions = {
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

const browsUpCenterBuffer: number[] = [0];
const browsUpLeftBuffer: number[] = [0];
const browsUpRightBuffer: number[] = [0];
const browsDownLeftBuffer: number[] = [0];
const browsDownRightBuffer: number[] = [0];
const puffBuffer: number[] = [0];

const browsUpCenterSet: number[] = [];
const browsUpLeftSet: number[] = [];
const browsUpRightSet: number[] = [];
const browsDownLeftSet: number[] = [];
const browsDownRightSet: number[] = [];
const puffSet: number[] = [];
const minBuffer: number[] = [0.7];
const maxBuffer: number[] = [0.3];

let browsUpCenter_r: number = 0;
let browsUpLeft_r: number = 0;
let browsUpRight_r: number = 0;
let browsDownLeft_r: number = 0;
let browsDownRight_r: number = 0;
let puff_r: number;

let jawOpenOutput: number;
let bitmojiTongueOutOutput: number;
let lipsFunnelOutput: number;
let lipsPuckerOutput: number;
let mouthCloseOutput: number;

let tongue01T: Transform;
let tongue02T: Transform;
let tongue03T: Transform;
let tongue04T: Transform;

let tongue01Position: vec3;
let tongue02Position: vec3;
let tongue03Position: vec3;
let tongue04Position: vec3;
let tongue01Rotation: quat;
let tongue02Rotation: quat;
let tongue03Rotation: quat;
let tongue04Rotation: quat;
let tongue001Position: vec3;
let tongue001Rotation: quat;
let tongue002Position: vec3;
let tongue002Rotation: vec3;
let tongue003Position: vec3;
let tongue003Rotation: quat;
let tongue004Position: vec3;
let tongue004Rotation: quat;

export function initializeTongue(tongue001: SceneObject, tongue002: SceneObject, tongue003: SceneObject, tongue004: SceneObject): void {
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

export function updateJaw(jawJointT: Transform): void {
    const jawRot_x = jawOpenOutput * 23.3;
    jawJointT.setLocalRotation(quat.fromEulerVec(new vec3(degreesToRadians(-60 + jawRot_x), 0, degreesToRadians(90))));
}

export function isTongueOpen(outputWeights: number): boolean {
    if (outputWeights >= 0.5) {
        tongue01T.setLocalPosition(new vec3(tongue001Position.x,
            tongue001Position.y + bitmojiTongueOutOutput * outputWeights * 0.04,
            tongue001Position.z - bitmojiTongueOutOutput * outputWeights * 0.05));
        tongue02T.setLocalPosition(new vec3(tongue002Position.x + bitmojiTongueOutOutput * outputWeights * 0.02,
            tongue002Position.y - bitmojiTongueOutOutput * outputWeights * 0.01,
            tongue002Position.z));
        tongue02T.setLocalRotation(quat.fromEulerAngles(tongue002Rotation.x,
            tongue002Rotation.y - 1.5 * bitmojiTongueOutOutput * MathUtils.DegToRad * outputWeights,
            tongue002Rotation.z));
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
    } else {
        tongue03T.setLocalPosition(vec3.slerp(tongue03Position, tongue003Position, (Math.min(5 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        tongue03T.setLocalRotation(quat.slerp(tongue03Rotation, tongue003Rotation, (Math.min(5 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        tongue04T.setLocalPosition(vec3.slerp(tongue04Position, tongue004Position, (5 * Math.min(1 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        tongue04T.setLocalRotation(quat.slerp(tongue04Rotation, tongue004Rotation, (5 * Math.min(1 - bitmojiTongueOutOutput, 2.5 - jawOpenOutput))));
        return false;
    }
}

export function updateExpressions(mlOutputData: Float32Array, tongueSize: number, smoothness: number, frown: number,
    headRotation: vec3, outputWeights: number, useBuffer: boolean, eyeOutputs: EyeOutputs): {} {
    lerpExpressions(mlOutputData, smoothness);

    if (useBuffer) {
        browsUpCenter_r = browsUpCenterBuffer[0] = findNeutral(expressions.BrowsUpCenter, browsUpCenterSet);
        browsUpLeft_r = browsUpLeftBuffer[0] = findNeutral(expressions.BrowsUpLeft, browsUpLeftSet);
        browsUpRight_r = browsUpRightBuffer[0] = findNeutral(expressions.BrowsUpRight, browsUpRightSet);
        browsDownLeft_r = browsDownLeftBuffer[0] = findNeutral(expressions.BrowsDownLeft, browsDownLeftSet);
        browsDownRight_r = browsDownRightBuffer[0] = findNeutral(expressions.BrowsDownRight, browsDownRightSet);
        puff_r = puffBuffer[0] = findNeutral(expressions.Puff, puffSet);
    }

    const browsUpCenterCalibrated = recalibrate(expressions.BrowsUpCenter, browsUpCenter_r, browsUpCenterBuffer);
    const browsUpLeftCalibrated = recalibrate(expressions.BrowsUpLeft, browsUpLeft_r, browsUpLeftBuffer);
    const browsUpRightCalibrated = recalibrate(expressions.BrowsUpRight, browsUpRight_r, browsUpRightBuffer);
    const browsDownLeftCalibrated = recalibrate(expressions.BrowsDownLeft, browsDownLeft_r, browsDownLeftBuffer);
    const browsDownRightCalibrated = recalibrate(expressions.BrowsDownRight, browsDownRight_r, browsDownRightBuffer);

    const puffCalibrated = recalibrate(expressions.Puff, puff_r, puffBuffer);
    const puffNormalized = scaleNormalizer(expressions.Puff, minBuffer, maxBuffer);

    const lipsFunnelPuckerCalibrated = Math.max(Math.max(expressions.LipsFunnel, expressions.LipsPucker) - 0.1, 0);
    const mouthStretchAvg = expressions.MouthStretchLeft / 2 + expressions.MouthStretchRight / 2;

    // Usage
    const bitmojiBrowDownCenterOutput = ExpressionsCalculation.calculateBitmojiBrowDownCenterOutput(browsDownLeftCalibrated, browsDownRightCalibrated);

    const browsDownLeftOutput = ExpressionsCalculation.calculateBrowsDownLeftOutput(browsDownLeftCalibrated);
    const browsDownRightOutput = ExpressionsCalculation.calculateBrowsDownRightOutput(browsDownRightCalibrated);
    const browsUpCenterOutput = ExpressionsCalculation.calculateBrowsUpCenterOutput(browsUpCenterCalibrated);
    const browsUpLeftOutput = ExpressionsCalculation.calculateBrowsUpLeftOutput(browsUpLeftCalibrated);
    const browsUpRightOutput = ExpressionsCalculation.calculateBrowsUpRightOutput(browsUpRightCalibrated);

    const eyeBlinkLeftCalibrated = ExpressionsCalculation.calculateEyeBlinkLeftCalibrated(expressions);
    const eyeBlinkRightCalibrated = ExpressionsCalculation.calculateEyeBlinkRightCalibrated(expressions);

    const cheekSquintLeftOutput = ExpressionsCalculation.calculateCheekSquintLeftOutput(expressions, eyeBlinkLeftCalibrated);
    const cheekSquintRightOutput = ExpressionsCalculation.calculateCheekSquintRightOutput(expressions, eyeBlinkRightCalibrated);

    const eyeOpenLeftOutput = ExpressionsCalculation.calculateEyeOpenLeftOutput(expressions, eyeBlinkLeftCalibrated);
    const eyeOpenRightOutput = ExpressionsCalculation.calculateEyeOpenRightOutput(expressions, eyeBlinkRightCalibrated);
    const eyeSquintLeftOutput = ExpressionsCalculation.calculateEyeSquintLeftOutput(expressions, eyeBlinkLeftCalibrated);
    const eyeSquintRightOutput = ExpressionsCalculation.calculateEyeSquintRightOutput(expressions, eyeBlinkRightCalibrated);

    jawOpenOutput = ExpressionsCalculation.calculateJawOpenOutput(expressions);
    bitmojiTongueOutOutput = ExpressionsCalculation.calculateBitmojiTongueOutOutput(jawOpenOutput, tongueSize);

    lipsFunnelOutput = ExpressionsCalculation.calculateLipsFunnelOutput(lipsFunnelPuckerCalibrated, expressions);
    const lipsPuckerCalibrated = ExpressionsCalculation.calculateLipsPuckerCalibrated(lipsFunnelPuckerCalibrated, expressions, mouthStretchAvg, frown, lipsFunnelOutput);
    lipsPuckerOutput = ExpressionsCalculation.calculateLipsPuckerOutput(lipsPuckerCalibrated);

    const lowerLipCloseOutput = ExpressionsCalculation.calculateLowerLipCloseOutput(expressions, frown, headRotation);
    const lowerLipDownLeftOutput = ExpressionsCalculation.calculateLowerLipDownLeftOutput(expressions, bitmojiTongueOutOutput, lipsFunnelOutput);
    const lowerLipDownRightOutput = ExpressionsCalculation.calculateLowerLipDownRightOutput(expressions, bitmojiTongueOutOutput, lipsFunnelOutput);
    const lowerLipRaiseOutput = ExpressionsCalculation.calculateLowerLipRaiseOutput(expressions, frown);

    const upperLipCloseOutput = ExpressionsCalculation.calculateUpperLipCloseOutput(expressions, frown, headRotation);
    const upperLipUpLeftOutput = ExpressionsCalculation.calculateUpperLipUpLeftOutput(expressions, browsDownLeftCalibrated, browsDownRightCalibrated, lipsFunnelOutput, lipsPuckerOutput);
    const upperLipUpRightOutput = ExpressionsCalculation.calculateUpperLipUpRightOutput(expressions, browsDownLeftCalibrated, browsDownRightCalibrated, lipsFunnelOutput, lipsPuckerOutput);
    const upperLipRaiseOutput = ExpressionsCalculation.calculateUpperLipRaiseOutput(expressions, frown);

    const mouthDimpleLeftOutput = ExpressionsCalculation.calculateMouthDimpleLeftOutput(expressions);
    const mouthDimpleRightOutput = ExpressionsCalculation.calculateMouthDimpleRightOutput(expressions);

    const mouthFrownLeftCalibrated = ExpressionsCalculation.calculateMouthFrownLeftCalibrated(expressions, mouthStretchAvg, frown);
    const mouthFrownRightCalibrated = ExpressionsCalculation.calculateMouthFrownRightCalibrated(expressions, mouthStretchAvg, frown);
    const mouthFrownLeftOutput = ExpressionsCalculation.calculateMouthFrownLeftOutput(mouthFrownLeftCalibrated, mouthFrownRightCalibrated);
    const mouthFrownRightOutput = ExpressionsCalculation.calculateMouthFrownRightOutput(mouthFrownRightCalibrated, mouthFrownLeftCalibrated);

    const mouthLeftOutput = ExpressionsCalculation.calculateMouthLeftOutput(expressions);
    const mouthRightOutput = ExpressionsCalculation.calculateMouthRightOutput(expressions);

    const mouthSmileLeftOutput = ExpressionsCalculation.calculateMouthSmileLeftOutput(expressions, frown);
    const mouthSmileRightOutput = ExpressionsCalculation.calculateMouthSmileRightOutput(expressions, frown);

    const mouthStretchLeftOutput = ExpressionsCalculation.calculateMouthStretchLeftOutput();
    const mouthStretchRightOutput = ExpressionsCalculation.calculateMouthStretchRightOutput();

    const mouthUpLeftOutput = ExpressionsCalculation.calculateMouthUpLeftOutput(mouthLeftOutput);
    const mouthUpRightOutput = ExpressionsCalculation.calculateMouthUpRightOutput(mouthRightOutput);

    const puffOutput = ExpressionsCalculation.calculatePuffOutput(expressions, lipsFunnelOutput, lipsPuckerCalibrated, mouthLeftOutput, mouthRightOutput, puffCalibrated, puffNormalized, average, jawOpenOutput, mouthCloseOutput);

    const sneerLeftOutput = ExpressionsCalculation.calculateSneerLeftOutput(expressions);
    const sneerRightOutput = ExpressionsCalculation.calculateSneerRightOutput(expressions);

    const bInput = ExpressionsCalculation.calculateBInput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, mouthSmileLeftOutput, mouthSmileRightOutput);
    const bitmojiBlinkHappyCalibrated = ExpressionsCalculation.calculateBitmojiBlinkHappyCalibrated(bInput);

    const eyeBlinkLeftOutput = ExpressionsCalculation.calculateEyeBlinkLeftOutput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, bitmojiBlinkHappyCalibrated);
    const eyeBlinkRightOutput = ExpressionsCalculation.calculateEyeBlinkRightOutput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, bitmojiBlinkHappyCalibrated);

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

function lerpExpressions(mlOutputData: Float32Array, smoothness: number): void {
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
