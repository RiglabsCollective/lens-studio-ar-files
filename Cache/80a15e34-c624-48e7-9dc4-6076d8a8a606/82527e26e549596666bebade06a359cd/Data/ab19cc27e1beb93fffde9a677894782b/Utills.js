"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleNormalizer = exports.recalibrate = exports.findNeutral = exports.findAverage = void 0;
const MathUtills_1 = require("./MathUtills");
function findAverage(input, bucketSize, setName) {
    if (setName.length < bucketSize) {
        setName.push(input);
    }
    else {
        setName.shift();
        setName.push(input);
    }
    let total = 0;
    for (let i = 0; i < setName.length; ++i) {
        total += setName[i];
    }
    return total / setName.length;
    ;
}
exports.findAverage = findAverage;
function findNeutral(input, set) {
    return findAverage(input, 15, set);
}
exports.findNeutral = findNeutral;
function recalibrate(rawValue, neutralValue, referenceValue) {
    const avg = (0, MathUtills_1.average)(rawValue, neutralValue);
    let calAvg;
    if (rawValue > neutralValue) {
        calAvg = rawValue;
    }
    else {
        calAvg = avg;
        if (calAvg < referenceValue[0]) {
            referenceValue[0] = avg;
            return 0;
        }
    }
    const diff = Math.max(calAvg - referenceValue[0], 0);
    const coef = 1 / (1 - referenceValue[0]);
    return diff * coef;
}
exports.recalibrate = recalibrate;
function scaleNormalizer(rawInput, minBufferName, maxBufferName) {
    if (rawInput <= minBufferName[0] && rawInput >= 0.1) {
        minBufferName.shift();
        minBufferName.push(rawInput);
    }
    if (rawInput >= maxBufferName[0] && rawInput <= 1) {
        maxBufferName[0] = rawInput;
    }
    if (maxBufferName[0] - minBufferName[0] <= 0) {
        return 0;
    }
    return Math.max(rawInput - minBufferName[0], 0) / Math.max(maxBufferName[0] - minBufferName[0], 0.01);
}
exports.scaleNormalizer = scaleNormalizer;
//# sourceMappingURL=Utills.js.map