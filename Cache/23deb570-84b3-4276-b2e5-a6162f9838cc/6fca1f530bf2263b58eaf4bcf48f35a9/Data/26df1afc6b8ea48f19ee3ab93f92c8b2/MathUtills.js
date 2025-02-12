"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.blendAverage = exports.balloon = exports.expCos = exports.normalizeEulerVec = exports.normalizeEuler = exports.degreesToRadians = exports.radiansToDegrees = void 0;
function radiansToDegrees(radians) {
    return radians * MathUtils.RadToDeg;
}
exports.radiansToDegrees = radiansToDegrees;
function degreesToRadians(degrees) {
    return degrees * MathUtils.DegToRad;
}
exports.degreesToRadians = degreesToRadians;
function normalizeEuler(radians) {
    let normalizedRad = radians % (2 * Math.PI);
    if (normalizedRad >= Math.PI) {
        normalizedRad -= 2 * Math.PI;
    }
    else if (normalizedRad < -Math.PI) {
        normalizedRad += 2 * Math.PI;
    }
    return normalizedRad;
}
exports.normalizeEuler = normalizeEuler;
function normalizeEulerVec(vec) {
    vec.x = normalizeEuler(vec.x);
    vec.y = normalizeEuler(vec.y);
    vec.z = normalizeEuler(vec.z);
    return vec;
}
exports.normalizeEulerVec = normalizeEulerVec;
function expCos(x, power) {
    return (-0.5 * (Math.cos(Math.PI * x) - 1)) ** power;
}
exports.expCos = expCos;
let balloonSize = 0;
const balloonOut = -0.2;
const balloonMax = 2.5;
function balloon(b_input) {
    if (balloonSize <= balloonMax && balloonSize >= 0) {
        balloonSize += (b_input + balloonOut) * (2 - 2 * (b_input + balloonOut));
    }
    else if (balloonSize > balloonMax) {
        balloonSize = balloonMax;
    }
    else {
        balloonSize = 0;
    }
    return balloonSize / balloonMax;
}
exports.balloon = balloon;
function blendAverage(inputA, inputB, threshold, limit) {
    let outputA;
    let outputB;
    const avg = average(inputA, inputB);
    const diffA = inputA - avg;
    const diffB = inputB - avg;
    const absDiffA = Math.abs(diffA);
    const absDiffB = Math.abs(diffB);
    if (absDiffA <= threshold) {
        outputA = avg;
    }
    else if (absDiffA > threshold && absDiffA <= limit) {
        outputA = avg + MathUtils.remap(absDiffA, threshold, limit, 0, diffA);
    }
    else {
        outputA = inputA;
    }
    if (absDiffB <= threshold) {
        outputB = avg;
    }
    else if (absDiffB > threshold && absDiffB <= limit) {
        outputB = avg + MathUtils.remap(absDiffB, threshold, limit, 0, diffB);
    }
    else {
        outputB = inputB;
    }
    return [outputA, outputB];
}
exports.blendAverage = blendAverage;
function average(inputA, inputB) {
    return (inputA + inputB) * 0.5;
}
exports.average = average;
//# sourceMappingURL=MathUtills.js.map