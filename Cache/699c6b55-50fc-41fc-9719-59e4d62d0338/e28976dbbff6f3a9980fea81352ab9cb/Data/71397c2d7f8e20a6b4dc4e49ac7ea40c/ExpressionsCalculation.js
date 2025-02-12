"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionsCalculation = void 0;
const MathUtills_1 = require("../Utils/MathUtills");
var ExpressionsCalculation;
(function (ExpressionsCalculation) {
    function calculateBitmojiBrowDownCenterOutput(browsDownLeftCalibrated, browsDownRightCalibrated) {
        return (0, MathUtills_1.expCos)(MathUtils.clamp(Math.min(2.5 * browsDownLeftCalibrated, 2.5 * browsDownRightCalibrated), 0, 1), 1);
    }
    ExpressionsCalculation.calculateBitmojiBrowDownCenterOutput = calculateBitmojiBrowDownCenterOutput;
    function calculateBrowsDownLeftOutput(browsDownLeftCalibrated) {
        return MathUtils.clamp(2.5 * browsDownLeftCalibrated, 0, 1);
    }
    ExpressionsCalculation.calculateBrowsDownLeftOutput = calculateBrowsDownLeftOutput;
    function calculateBrowsDownRightOutput(browsDownRightCalibrated) {
        return MathUtils.clamp(2.5 * browsDownRightCalibrated, 0, 1);
    }
    ExpressionsCalculation.calculateBrowsDownRightOutput = calculateBrowsDownRightOutput;
    function calculateBrowsUpCenterOutput(browsUpCenterCalibrated) {
        return MathUtils.clamp(3 * browsUpCenterCalibrated, 0, 1.25);
    }
    ExpressionsCalculation.calculateBrowsUpCenterOutput = calculateBrowsUpCenterOutput;
    function calculateBrowsUpLeftOutput(browsUpLeftCalibrated) {
        return MathUtils.clamp(1.5 * browsUpLeftCalibrated, 0, 1.25);
    }
    ExpressionsCalculation.calculateBrowsUpLeftOutput = calculateBrowsUpLeftOutput;
    function calculateBrowsUpRightOutput(browsUpRightCalibrated) {
        return MathUtils.clamp(1.5 * browsUpRightCalibrated, 0, 1.25);
    }
    ExpressionsCalculation.calculateBrowsUpRightOutput = calculateBrowsUpRightOutput;
    function calculateEyeBlinkLeftCalibrated(expressions) {
        return (0, MathUtills_1.expCos)(1.5 * Math.min(expressions.EyeBlinkLeft, 0.67), 2.5);
    }
    ExpressionsCalculation.calculateEyeBlinkLeftCalibrated = calculateEyeBlinkLeftCalibrated;
    function calculateEyeBlinkRightCalibrated(expressions) {
        return (0, MathUtills_1.expCos)(1.5 * Math.min(expressions.EyeBlinkRight, 0.67), 2.5);
    }
    ExpressionsCalculation.calculateEyeBlinkRightCalibrated = calculateEyeBlinkRightCalibrated;
    function calculateCheekSquintLeftOutput(expressions, eyeBlinkLeftCalibrated) {
        return Math.min(expressions.EyeSquintLeft + expressions.MouthSmileLeft, 1) * (1 - eyeBlinkLeftCalibrated);
    }
    ExpressionsCalculation.calculateCheekSquintLeftOutput = calculateCheekSquintLeftOutput;
    function calculateCheekSquintRightOutput(expressions, eyeBlinkRightCalibrated) {
        return Math.min(expressions.EyeSquintRight + expressions.MouthSmileRight, 1) * (1 - eyeBlinkRightCalibrated);
    }
    ExpressionsCalculation.calculateCheekSquintRightOutput = calculateCheekSquintRightOutput;
    function calculateEyeOpenLeftOutput(expressions, eyeBlinkLeftCalibrated) {
        return Math.min(1 * expressions.EyeOpenLeft, 1) * (1 - eyeBlinkLeftCalibrated);
    }
    ExpressionsCalculation.calculateEyeOpenLeftOutput = calculateEyeOpenLeftOutput;
    function calculateEyeOpenRightOutput(expressions, eyeBlinkRightCalibrated) {
        return Math.min(1 * expressions.EyeOpenRight, 1) * (1 - eyeBlinkRightCalibrated);
    }
    ExpressionsCalculation.calculateEyeOpenRightOutput = calculateEyeOpenRightOutput;
    function calculateEyeSquintLeftOutput(expressions, eyeBlinkLeftCalibrated) {
        return expressions.EyeSquintLeft * (1 - eyeBlinkLeftCalibrated);
    }
    ExpressionsCalculation.calculateEyeSquintLeftOutput = calculateEyeSquintLeftOutput;
    function calculateEyeSquintRightOutput(expressions, eyeBlinkRightCalibrated) {
        return expressions.EyeSquintRight * (1 - eyeBlinkRightCalibrated);
    }
    ExpressionsCalculation.calculateEyeSquintRightOutput = calculateEyeSquintRightOutput;
    function calculateJawOpenOutput(expressions) {
        return (0, MathUtills_1.expCos)(Math.min(1.25 * expressions.JawOpen, 1), 1 + expressions.MouthSmileLeft / 4 + expressions.MouthSmileRight / 4);
    }
    ExpressionsCalculation.calculateJawOpenOutput = calculateJawOpenOutput;
    function calculateBitmojiTongueOutOutput(jawOpenOutput, tongueSize) {
        return jawOpenOutput ** 0.5 * (0, MathUtills_1.expCos)(tongueSize / 10, 1.5);
    }
    ExpressionsCalculation.calculateBitmojiTongueOutOutput = calculateBitmojiTongueOutOutput;
    function calculateLipsFunnelOutput(lipsFunnelPuckerCalibrated, expressions) {
        return Math.min(3 * (lipsFunnelPuckerCalibrated + expressions.LipsFunnel) * Math.min(3 * Math.max(expressions.JawOpen - 0.1, 0), 1) * (1 - 2.5 * Math.max(expressions.JawOpen - 0.6, 0)), 1) * Math.max(1 - 1.1 * expressions.MouthClose, 0);
    }
    ExpressionsCalculation.calculateLipsFunnelOutput = calculateLipsFunnelOutput;
    function calculateLipsPuckerCalibrated(lipsFunnelPuckerCalibrated, expressions, mouthStretchAvg, frown, lipsFunnelOutput) {
        return Math.min(Math.min(Math.max(lipsFunnelPuckerCalibrated + expressions.LipsPucker - mouthStretchAvg - expressions.LowerLipRaise / 2, 0) * Math.max(1 - 2.5 * expressions.JawOpen, 0) * Math.max((1 - Math.max(expressions.MouthSmileLeft, expressions.MouthSmileRight)) * (1 - frown ** 2), 0), 1), 1 - lipsFunnelOutput);
    }
    ExpressionsCalculation.calculateLipsPuckerCalibrated = calculateLipsPuckerCalibrated;
    function calculateLipsPuckerOutput(lipsPuckerCalibrated) {
        return (0, MathUtills_1.expCos)(lipsPuckerCalibrated, 1.6);
    }
    ExpressionsCalculation.calculateLipsPuckerOutput = calculateLipsPuckerOutput;
    function calculateLowerLipCloseOutput(expressions, frown, headRotation) {
        return Math.min(Math.min(5 * Math.max(expressions.LowerLipClose - 0.1, 0) + expressions.UpperLipClose, 1) * Math.max(1 - expressions.MouthSmileLeft - expressions.MouthSmileRight - frown ** 3 - Math.min((0, MathUtills_1.normalizeEuler)(headRotation.z) ** 2, 1), 0) * 5 * MathUtils.clamp(expressions.UpperLipClose + expressions.LowerLipClose - 0.2, 0, 0.2), 1);
    }
    ExpressionsCalculation.calculateLowerLipCloseOutput = calculateLowerLipCloseOutput;
    function calculateLowerLipDownLeftOutput(expressions, bitmojiTongueOutOutput, lipsFunnelOutput) {
        return Math.min(Math.min(expressions.LowerLipDownLeft + 2 * expressions.MouthSmileLeft + bitmojiTongueOutOutput, 1.25) * Math.max(expressions.JawOpen - 0.02, 0) * 2 * Math.max(1 - lipsFunnelOutput, 0), 1);
    }
    ExpressionsCalculation.calculateLowerLipDownLeftOutput = calculateLowerLipDownLeftOutput;
    function calculateLowerLipDownRightOutput(expressions, bitmojiTongueOutOutput, lipsFunnelOutput) {
        return Math.min(Math.min(expressions.LowerLipDownRight + 2 * expressions.MouthSmileRight + bitmojiTongueOutOutput, 1.25) * Math.max(expressions.JawOpen - 0.02, 0) * 2 * Math.max(1 - lipsFunnelOutput, 0), 1);
    }
    ExpressionsCalculation.calculateLowerLipDownRightOutput = calculateLowerLipDownRightOutput;
    function calculateLowerLipRaiseOutput(expressions, frown) {
        return Math.min(2 * Math.min(1.5 * expressions.LowerLipClose + frown ** 2, 1) * Math.max(1 - expressions.JawOpen - 0.5, 0), 1);
    }
    ExpressionsCalculation.calculateLowerLipRaiseOutput = calculateLowerLipRaiseOutput;
    function calculateUpperLipCloseOutput(expressions, frown, headRotation) {
        return Math.min(Math.min(5 * Math.max(expressions.UpperLipClose - 0.1, 0) + expressions.LowerLipClose, 1) * Math.max(1 - expressions.MouthSmileLeft - expressions.MouthSmileRight - frown ** 3 - Math.min((0, MathUtills_1.normalizeEuler)(headRotation.z) ** 2, 1), 0) * 5 * MathUtils.clamp(expressions.UpperLipClose + expressions.LowerLipClose - 0.2, 0, 0.2), 1);
    }
    ExpressionsCalculation.calculateUpperLipCloseOutput = calculateUpperLipCloseOutput;
    function calculateUpperLipUpLeftOutput(expressions, browsDownLeftCalibrated, browsDownRightCalibrated, lipsFunnelOutput, lipsPuckerOutput) {
        return MathUtils.clamp(Math.min(1.5 * expressions.UpperLipUpLeft + expressions.MouthSmileLeft / 2, 1.5) * Math.max(1 - 1.25 * Math.min(browsDownLeftCalibrated, browsDownRightCalibrated) - expressions.JawOpen / 3, 0) * Math.max(expressions.JawOpen - 0.015, 0) * Math.max(1 - 3 * Math.abs(expressions.MouthLeft - expressions.MouthRight), 0) * (1 - expressions.MouthClose) ** 2 * (1 - Math.max(lipsFunnelOutput, lipsPuckerOutput)) * 30, 0, 1);
    }
    ExpressionsCalculation.calculateUpperLipUpLeftOutput = calculateUpperLipUpLeftOutput;
    function calculateUpperLipUpRightOutput(expressions, browsDownLeftCalibrated, browsDownRightCalibrated, lipsFunnelOutput, lipsPuckerOutput) {
        return MathUtils.clamp(Math.min(1.5 * expressions.UpperLipUpRight + expressions.MouthSmileRight / 2, 1.5) * Math.max(1 - 1.25 * Math.min(browsDownLeftCalibrated, browsDownRightCalibrated) - expressions.JawOpen / 3, 0) * Math.max(expressions.JawOpen - 0.015, 0) * Math.max(1 - 3 * Math.abs(expressions.MouthLeft - expressions.MouthRight), 0) * (1 - expressions.MouthClose) ** 2 * (1 - Math.max(lipsFunnelOutput, lipsPuckerOutput)) * 30, 0, 1);
    }
    ExpressionsCalculation.calculateUpperLipUpRightOutput = calculateUpperLipUpRightOutput;
    function calculateUpperLipRaiseOutput(expressions, frown) {
        return Math.min(2 * Math.min(1.5 * expressions.LowerLipClose + frown ** 2, 1) * Math.max(1 - expressions.JawOpen - 0.5, 0), 1);
    }
    ExpressionsCalculation.calculateUpperLipRaiseOutput = calculateUpperLipRaiseOutput;
    function calculateMouthDimpleLeftOutput(expressions) {
        return Math.min(1.25 * Math.max(expressions.MouthLeft - expressions.MouthRight + expressions.MouthSmileLeft, 0), 1) * Math.max(1 - expressions.JawOpen, 0);
    }
    ExpressionsCalculation.calculateMouthDimpleLeftOutput = calculateMouthDimpleLeftOutput;
    function calculateMouthDimpleRightOutput(expressions) {
        return Math.min(1.25 * Math.max(expressions.MouthRight - expressions.MouthLeft + expressions.MouthSmileRight, 0), 1) * Math.max(1 - expressions.JawOpen, 0);
    }
    ExpressionsCalculation.calculateMouthDimpleRightOutput = calculateMouthDimpleRightOutput;
    function calculateMouthFrownLeftCalibrated(expressions, mouthStretchAvg, frown) {
        return (Math.min(4 * Math.max(Math.max(expressions.LowerLipRaise / 2 + expressions.MouthStretchLeft / 2 + mouthStretchAvg / 2 - expressions.MouthSmileLeft / 3, (0, MathUtills_1.expCos)(frown, 2)) - 0.2, 0) * Math.max(1 - expressions.JawOpen + expressions.MouthClose, 0), 1)) ** 2;
    }
    ExpressionsCalculation.calculateMouthFrownLeftCalibrated = calculateMouthFrownLeftCalibrated;
    function calculateMouthFrownRightCalibrated(expressions, mouthStretchAvg, frown) {
        return (Math.min(4 * Math.max(Math.max(expressions.LowerLipRaise / 2 + expressions.MouthStretchRight / 2 + mouthStretchAvg / 2 - expressions.MouthSmileRight / 3, (0, MathUtills_1.expCos)(frown, 2)) - 0.2, 0) * Math.max(1 - expressions.JawOpen + expressions.MouthClose, 0), 1)) ** 2;
    }
    ExpressionsCalculation.calculateMouthFrownRightCalibrated = calculateMouthFrownRightCalibrated;
    function calculateMouthFrownLeftOutput(mouthFrownLeftCalibrated, mouthFrownRightCalibrated) {
        return 0.75 * (mouthFrownLeftCalibrated) + 0.25 * (mouthFrownRightCalibrated);
    }
    ExpressionsCalculation.calculateMouthFrownLeftOutput = calculateMouthFrownLeftOutput;
    function calculateMouthFrownRightOutput(mouthFrownRightCalibrated, mouthFrownLeftCalibrated) {
        return 0.75 * (mouthFrownRightCalibrated) + 0.25 * (mouthFrownLeftCalibrated);
    }
    ExpressionsCalculation.calculateMouthFrownRightOutput = calculateMouthFrownRightOutput;
    function calculateMouthLeftOutput(expressions) {
        return Math.min(1.25 * Math.max(expressions.MouthLeft - expressions.MouthRight, 0), 1);
    }
    ExpressionsCalculation.calculateMouthLeftOutput = calculateMouthLeftOutput;
    function calculateMouthRightOutput(expressions) {
        return Math.min(1.25 * Math.max(expressions.MouthRight - expressions.MouthLeft, 0), 1);
    }
    ExpressionsCalculation.calculateMouthRightOutput = calculateMouthRightOutput;
    function calculateMouthSmileLeftOutput(expressions, frown) {
        return Math.min(1.5 * (expressions.MouthSmileLeft - expressions.LowerLipRaise) * (1 - frown ** 2), 1);
    }
    ExpressionsCalculation.calculateMouthSmileLeftOutput = calculateMouthSmileLeftOutput;
    function calculateMouthSmileRightOutput(expressions, frown) {
        return Math.min(1.5 * (expressions.MouthSmileRight - expressions.LowerLipRaise) * (1 - frown ** 2), 1);
    }
    ExpressionsCalculation.calculateMouthSmileRightOutput = calculateMouthSmileRightOutput;
    function calculateMouthStretchLeftOutput() {
        return 0;
    }
    ExpressionsCalculation.calculateMouthStretchLeftOutput = calculateMouthStretchLeftOutput;
    function calculateMouthStretchRightOutput() {
        return 0;
    }
    ExpressionsCalculation.calculateMouthStretchRightOutput = calculateMouthStretchRightOutput;
    function calculateMouthUpLeftOutput(mouthLeftOutput) {
        return 0.8 * mouthLeftOutput;
    }
    ExpressionsCalculation.calculateMouthUpLeftOutput = calculateMouthUpLeftOutput;
    function calculateMouthUpRightOutput(mouthRightOutput) {
        return 0.8 * mouthRightOutput;
    }
    ExpressionsCalculation.calculateMouthUpRightOutput = calculateMouthUpRightOutput;
    function calculatePuffOutput(expressions, lipsFunnelOutput, lipsPuckerCalibrated, mouthLeftOutput, mouthRightOutput, puffCalibrated, puffNormalized, average, jawOpenOutput, mouthCloseOutput) {
        return Math.max(1 - Math.max(lipsFunnelOutput, lipsPuckerCalibrated), 0) * Math.max(1 - 3 * Math.max(mouthLeftOutput, mouthRightOutput), 0) * Math.min(Math.max(puffCalibrated, (0, MathUtills_1.expCos)(Math.min(puffNormalized, average(puffNormalized ** 2, expressions.Puff)), 1) * Math.max(1 - Math.min(2 * jawOpenOutput, 1) + mouthCloseOutput / 3, 0)), 1 - 0.7 * Math.max(expressions.MouthSmileLeft, expressions.MouthSmileRight));
    }
    ExpressionsCalculation.calculatePuffOutput = calculatePuffOutput;
    function calculateSneerLeftOutput(expressions) {
        return Math.min(2 * expressions.SneerLeft, 1);
    }
    ExpressionsCalculation.calculateSneerLeftOutput = calculateSneerLeftOutput;
    function calculateSneerRightOutput(expressions) {
        return Math.min(2 * expressions.SneerRight, 1);
    }
    ExpressionsCalculation.calculateSneerRightOutput = calculateSneerRightOutput;
    function calculateBInput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, mouthSmileLeftOutput, mouthSmileRightOutput) {
        return Math.min(5
            * Math.max((eyeBlinkLeftCalibrated + eyeBlinkRightCalibrated) * 0.5 - 0.6, 0)
            * Math.max((mouthSmileLeftOutput + mouthSmileRightOutput) * 0.5 - 0.5, 0), 1);
    }
    ExpressionsCalculation.calculateBInput = calculateBInput;
    function calculateBitmojiBlinkHappyCalibrated(bInput) {
        return (0, MathUtills_1.expCos)(MathUtils.clamp((0, MathUtills_1.balloon)(bInput), 0, 1), 2);
    }
    ExpressionsCalculation.calculateBitmojiBlinkHappyCalibrated = calculateBitmojiBlinkHappyCalibrated;
    function calculateEyeBlinkLeftOutput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, bitmojiBlinkHappyCalibrated) {
        return (0, MathUtills_1.blendAverage)(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, 0.15, 0.3)[0] * (1 - bitmojiBlinkHappyCalibrated);
    }
    ExpressionsCalculation.calculateEyeBlinkLeftOutput = calculateEyeBlinkLeftOutput;
    function calculateEyeBlinkRightOutput(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, bitmojiBlinkHappyCalibrated) {
        return (0, MathUtills_1.blendAverage)(eyeBlinkLeftCalibrated, eyeBlinkRightCalibrated, 0.15, 0.3)[1] * (1 - bitmojiBlinkHappyCalibrated);
    }
    ExpressionsCalculation.calculateEyeBlinkRightOutput = calculateEyeBlinkRightOutput;
})(ExpressionsCalculation || (exports.ExpressionsCalculation = ExpressionsCalculation = {}));
//# sourceMappingURL=ExpressionsCalculation.js.map