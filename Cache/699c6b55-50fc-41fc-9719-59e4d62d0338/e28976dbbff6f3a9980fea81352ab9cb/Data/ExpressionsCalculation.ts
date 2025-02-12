import { balloon, blendAverage, expCos, normalizeEuler } from '../Utils/MathUtills';
import { BitmojiExpressions } from './Expressions';

export namespace ExpressionsCalculation {
    export function calculateBitmojiBrowDownCenterOutput(browsDownLeftCalibrated: number, browsDownRightCalibrated: number): number {
        return expCos(MathUtils.clamp(Math.min(2.5 * browsDownLeftCalibrated, 2.5 * browsDownRightCalibrated),
            0,
            1),
        1);
    }

    export function calculateBrowsDownLeftOutput(browsDownLeftCalibrated: number): number {
        return MathUtils.clamp(2.5 * browsDownLeftCalibrated,
            0,
            1);
    }

    export function calculateBrowsDownRightOutput(browsDownRightCalibrated: number): number {
        return MathUtils.clamp(2.5 * browsDownRightCalibrated,
            0,
            1);
    }

    export function calculateBrowsUpCenterOutput(browsUpCenterCalibrated: number): number {
        return MathUtils.clamp(3 * browsUpCenterCalibrated,
            0,
            1.25);
    }

    export function calculateBrowsUpLeftOutput(browsUpLeftCalibrated: number): number {
        return MathUtils.clamp(1.5 * browsUpLeftCalibrated,
            0,
            1.25);
    }

    export function calculateBrowsUpRightOutput(browsUpRightCalibrated: number): number {
        return MathUtils.clamp(1.5 * browsUpRightCalibrated,
            0,
            1.25);
    }

    export function calculateEyeBlinkLeftCalibrated(expressions: BitmojiExpressions): number {
        return expCos(1.5 * Math.min(expressions.EyeBlinkLeft, 0.67),
            2.5);
    }

    export function calculateEyeBlinkRightCalibrated(expressions: BitmojiExpressions): number {
        return expCos(1.5 * Math.min(expressions.EyeBlinkRight, 0.67),
            2.5);
    }

    export function calculateCheekSquintLeftOutput(expressions: BitmojiExpressions, eyeBlinkLeftCalibrated: number): number {
        return Math.min(expressions.EyeSquintLeft + expressions.MouthSmileLeft,
            1) * (1 - eyeBlinkLeftCalibrated);
    }

    export function calculateCheekSquintRightOutput(expressions: BitmojiExpressions, eyeBlinkRightCalibrated: number): number {
        return Math.min(expressions.EyeSquintRight + expressions.MouthSmileRight,
            1) * (1 - eyeBlinkRightCalibrated);
    }

    export function calculateEyeOpenLeftOutput(expressions: BitmojiExpressions, eyeBlinkLeftCalibrated: number): number {
        return Math.min(1 * expressions.EyeOpenLeft,
            1) * (1 - eyeBlinkLeftCalibrated);
    }

    export function calculateEyeOpenRightOutput(expressions: BitmojiExpressions, eyeBlinkRightCalibrated: number): number {
        return Math.min(1 * expressions.EyeOpenRight,
            1) * (1 - eyeBlinkRightCalibrated);
    }

    export function calculateEyeSquintLeftOutput(expressions: BitmojiExpressions, eyeBlinkLeftCalibrated: number): number {
        return expressions.EyeSquintLeft * (1 - eyeBlinkLeftCalibrated);
    }

    export function calculateEyeSquintRightOutput(expressions: BitmojiExpressions, eyeBlinkRightCalibrated: number): number {
        return expressions.EyeSquintRight * (1 - eyeBlinkRightCalibrated);
    }

    export function calculateJawOpenOutput(expressions: BitmojiExpressions): number {
        return expCos(Math.min(1.25 * expressions.JawOpen, 1),
            1 + expressions.MouthSmileLeft / 4 + expressions.MouthSmileRight / 4);
    }

    export function calculateBitmojiTongueOutOutput(jawOpenOutput: number, tongueSize: number): number {
        return jawOpenOutput ** 0.5 * expCos(tongueSize / 10, 1.5);
    }

    export function calculateLipsFunnelOutput(lipsFunnelPuckerCalibrated: number, expressions: BitmojiExpressions): number {
        return Math.min(3 * (lipsFunnelPuckerCalibrated + expressions.LipsFunnel) * Math.min(3 * Math.max(expressions.JawOpen - 0.1, 0), 1) * (1 - 2.5 * Math.max(expressions.JawOpen - 0.6, 0)),
            1) * Math.max(1 - 1.1 * expressions.MouthClose, 0);
    }

    export function calculateLipsPuckerCalibrated(lipsFunnelPuckerCalibrated: number, expressions: BitmojiExpressions, mouthStretchAvg: number, frown: number, lipsFunnelOutput: number): number {
        return Math.min(Math.min(Math.max(lipsFunnelPuckerCalibrated + expressions.LipsPucker - mouthStretchAvg - expressions.LowerLipRaise / 2, 0) * Math.max(1 - 2.5 * expressions.JawOpen, 0) * Math.max((1 - Math.max(expressions.MouthSmileLeft, expressions.MouthSmileRight)) * (1 - frown ** 2), 0),
            1),
        1 - lipsFunnelOutput);
    }

    export function calculateLipsPuckerOutput(lipsPuckerCalibrated: number): number {
        return expCos(lipsPuckerCalibrated, 1.6);
    }

    export function calculateLowerLipCloseOutput(expressions: BitmojiExpressions, frown: number, headRotation: vec3): number {
        return Math.min(Math.min(5 * Math.max(expressions.LowerLipClose - 0.1, 0) + expressions.UpperLipClose,
            1) * Math.max(1 - expressions.MouthSmileLeft - expressions.MouthSmileRight - frown ** 3 - Math.min(normalizeEuler(headRotation.z) ** 2, 1),
            0) * 5 * MathUtils.clamp(expressions.UpperLipClose + expressions.LowerLipClose - 0.2,
            0,
            0.2),
        1);
    }

    export function calculateLowerLipDownLeftOutput(expressions: BitmojiExpressions, bitmojiTongueOutOutput: number, lipsFunnelOutput: number): number {
        return Math.min(Math.min(expressions.LowerLipDownLeft + 2 * expressions.MouthSmileLeft + bitmojiTongueOutOutput,
            1.25) * Math.max(expressions.JawOpen - 0.02, 0) * 2 * Math.max(1 - lipsFunnelOutput, 0),
        1);
    }

    export function calculateLowerLipDownRightOutput(expressions: BitmojiExpressions, bitmojiTongueOutOutput: number, lipsFunnelOutput: number): number {
        return Math.min(Math.min(expressions.LowerLipDownRight + 2 * expressions.MouthSmileRight + bitmojiTongueOutOutput,
            1.25) * Math.max(expressions.JawOpen - 0.02, 0) * 2 * Math.max(1 - lipsFunnelOutput, 0),
        1);
    }

    export function calculateLowerLipRaiseOutput(expressions: BitmojiExpressions, frown: number): number {
        return Math.min(2 * Math.min(1.5 * expressions.LowerLipClose + frown ** 2,
            1) * Math.max(1 - expressions.JawOpen - 0.5,
            0),
        1);
    }

    export function calculateUpperLipCloseOutput(expressions: BitmojiExpressions, frown: number, headRotation: vec3): number {
        return Math.min(Math.min(5 * Math.max(expressions.UpperLipClose - 0.1, 0) + expressions.LowerLipClose,
            1) * Math.max(1 - expressions.MouthSmileLeft - expressions.MouthSmileRight - frown ** 3 - Math.min(normalizeEuler(headRotation.z) ** 2, 1),
            0) * 5 * MathUtils.clamp(expressions.UpperLipClose + expressions.LowerLipClose - 0.2,
            0,
            0.2),
        1);
    }

    export function calculateUpperLipUpLeftOutput(expressions: BitmojiExpressions, browsDownLeftCalibrated: number, browsDownRightCalibrated: number, lipsFunnelOutput: number, lipsPuckerOutput: number): number {
        return MathUtils.clamp(Math.min(1.5 * expressions.UpperLipUpLeft + expressions.MouthSmileLeft / 2,
            1.5) * Math.max(1 - 1.25 * Math.min(browsDownLeftCalibrated, browsDownRightCalibrated) - expressions.JawOpen / 3,
            0) * Math.max(expressions.JawOpen - 0.015,
            0) * Math.max(1 - 3 * Math.abs(expressions.MouthLeft - expressions.MouthRight),
            0) * (1 - expressions.MouthClose) ** 2 * (1 - Math.max(lipsFunnelOutput, lipsPuckerOutput)) * 30,
        0,
        1);
    }

    export function calculateUpperLipUpRightOutput(expressions: BitmojiExpressions, browsDownLeftCalibrated: number, browsDownRightCalibrated: number, lipsFunnelOutput: number, lipsPuckerOutput: number): number {
        return MathUtils.clamp(Math.min(1.5 * expressions.UpperLipUpRight + expressions.MouthSmileRight / 2,
            1.5) * Math.max(1 - 1.25 * Math.min(browsDownLeftCalibrated, browsDownRightCalibrated) - expressions.JawOpen / 3,
            0) * Math.max(expressions.JawOpen - 0.015,
            0) * Math.max(1 - 3 * Math.abs(expressions.MouthLeft - expressions.MouthRight),
            0) * (1 - expressions.MouthClose) ** 2 * (1 - Math.max(lipsFunnelOutput, lipsPuckerOutput)) * 30,
        0,
        1);
    }

    export function calculateUpperLipRaiseOutput(expressions: BitmojiExpressions, frown: number): number {
        return Math.min(2 * Math.min(1.5 * expressions.LowerLipClose + frown ** 2,
            1) * Math.max(1 - expressions.JawOpen - 0.5,
            0),
        1);
    }

    export function calculateMouthDimpleLeftOutput(expressions: BitmojiExpressions): number {
        return Math.min(1.25 * Math.max(expressions.MouthLeft - expressions.MouthRight + expressions.MouthSmileLeft,
            0),
        1) * Math.max(1 - expressions.JawOpen,
            0);
    }

    export function calculateMouthDimpleRightOutput(expressions: BitmojiExpressions): number {
        return Math.min(1.25 * Math.max(expressions.MouthRight - expressions.MouthLeft + expressions.MouthSmileRight,
            0),
        1) * Math.max(1 - expressions.JawOpen,
            0);
    }

    export function calculateMouthFrownLeftCalibrated(expressions: BitmojiExpressions, mouthStretchAvg: number, frown: number): number {
        return (
            Math.min(4 * Math.max(Math.max(expressions.LowerLipRaise / 2 + expressions.MouthStretchLeft / 2 + mouthStretchAvg / 2 - expressions.MouthSmileLeft / 3,
                expCos(frown, 2)) - 0.2,
            0) * Math.max(1 - expressions.JawOpen + expressions.MouthClose,
                0),
            1)
        ) ** 2;
    }

    export function calculateMouthFrownRightCalibrated(expressions: BitmojiExpressions, mouthStretchAvg: number, frown: number): number {
        return (
            Math.min(4 * Math.max(Math.max(expressions.LowerLipRaise / 2 + expressions.MouthStretchRight / 2 + mouthStretchAvg / 2 - expressions.MouthSmileRight / 3,
                expCos(frown, 2)) - 0.2,
            0) * Math.max(1 - expressions.JawOpen + expressions.MouthClose,
                0),
            1)
        ) ** 2;
    }

    export function calculateMouthFrownLeftOutput(mouthFrownLeftCalibrated: number, mouthFrownRightCalibrated: number): number {
        return 0.75 * (mouthFrownLeftCalibrated) + 0.25 * (mouthFrownRightCalibrated);
    }

    export function calculateMouthFrownRightOutput(mouthFrownRightCalibrated: number, mouthFrownLeftCalibrated: number): number {
        return 0.75 * (mouthFrownRightCalibrated) + 0.25 * (mouthFrownLeftCalibrated);
    }

    export function calculateMouthLeftOutput(expressions: BitmojiExpressions): number {
        return Math.min(1.25 * Math.max(expressions.MouthLeft - expressions.MouthRight, 0),
            1);
    }

    export function calculateMouthRightOutput(expressions: BitmojiExpressions): number {
        return Math.min(1.25 * Math.max(expressions.MouthRight - expressions.MouthLeft, 0),
            1);
    }

    export function calculateMouthSmileLeftOutput(expressions: BitmojiExpressions, frown: number): number {
        return Math.min(1.5 * (expressions.MouthSmileLeft - expressions.LowerLipRaise) * (1 - frown ** 2),
            1);
    }

    export function calculateMouthSmileRightOutput(expressions: BitmojiExpressions, frown: number): number {
        return Math.min(1.5 * (expressions.MouthSmileRight - expressions.LowerLipRaise) * (1 - frown ** 2),
            1);
    }

    export function calculateMouthStretchLeftOutput(): number {
        return 0;
    }

    export function calculateMouthStretchRightOutput(): number {
        return 0;
    }

    export function calculateMouthUpLeftOutput(mouthLeftOutput: number): number {
        return 0.8 * mouthLeftOutput;
    }

    export function calculateMouthUpRightOutput(mouthRightOutput: number): number {
        return 0.8 * mouthRightOutput;
    }

    export function calculatePuffOutput(expressions: BitmojiExpressions, lipsFunnelOutput: number, lipsPuckerCalibrated: number, mouthLeftOutput: number, mouthRightOutput: number, puffCalibrated: number, puffNormalized: number, average: (a: number, b: number) => number, jawOpenOutput: number, mouthCloseOutput: number): number {
        return Math.max(1 - Math.max(lipsFunnelOutput, lipsPuckerCalibrated),
            0) * Math.max(1 - 3 * Math.max(mouthLeftOutput, mouthRightOutput),
            0) * Math.min(Math.max(puffCalibrated,
            expCos(Math.min(puffNormalized, average(puffNormalized ** 2, expressions.Puff)),
                1) * Math.max(1 - Math.min(2 * jawOpenOutput, 1) + mouthCloseOutput / 3,
                0)),
        1 - 0.7 * Math.max(expressions.MouthSmileLeft, expressions.MouthSmileRight));
    }

    export function calculateSneerLeftOutput(expressions: BitmojiExpressions): number {
        return Math.min(2 * expressions.SneerLeft,
            1);
    }

    export function calculateSneerRightOutput(expressions: BitmojiExpressions): number {
        return Math.min(2 * expressions.SneerRight,
            1);
    }

    export function calculateBInput(eyeBlinkLeftCalibrated: number, eyeBlinkRightCalibrated: number, mouthSmileLeftOutput: number, mouthSmileRightOutput: number): number {
        return Math.min(5
            * Math.max((
                eyeBlinkLeftCalibrated + eyeBlinkRightCalibrated) * 0.5 - 0.6,
            0)
            * Math.max((
                mouthSmileLeftOutput + mouthSmileRightOutput) * 0.5 - 0.5,
            0)
        , 1);
    }

    export function calculateBitmojiBlinkHappyCalibrated(bInput: number): number {
        return expCos(MathUtils.clamp(balloon(bInput),
            0,
            1),
        2);
    }

    export function calculateEyeBlinkLeftOutput(eyeBlinkLeftCalibrated: number, eyeBlinkRightCalibrated: number, bitmojiBlinkHappyCalibrated: number): number {
        return blendAverage(eyeBlinkLeftCalibrated,
            eyeBlinkRightCalibrated,
            0.15,
            0.3)[0] * (1 - bitmojiBlinkHappyCalibrated
        );
    }

    export function calculateEyeBlinkRightOutput(eyeBlinkLeftCalibrated: number, eyeBlinkRightCalibrated: number, bitmojiBlinkHappyCalibrated: number): number {
        return blendAverage(eyeBlinkLeftCalibrated,
            eyeBlinkRightCalibrated,
            0.15,
            0.3)[1] * (1 - bitmojiBlinkHappyCalibrated
        );
    }
}
