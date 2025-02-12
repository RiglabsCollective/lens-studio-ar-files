import { average } from './MathUtills';

export function findAverage(input: number, bucketSize: number, setName: number[]): number {
    if (setName.length < bucketSize) {
        setName.push(input);
    } else {
        setName.shift();
        setName.push(input);
    }
    let total = 0;
    for (let i = 0; i < setName.length; ++i) {
        total += setName[i];
    }
    return total / setName.length; ;
}

export function findNeutral(input: number, set: number[]) {
    return findAverage(input, 15, set);
}

export function recalibrate(rawValue: number, neutralValue: number, referenceValue: number[]): number {
    const avg = average(rawValue, neutralValue);
    let calAvg: number;
    if (rawValue > neutralValue) {
        calAvg = rawValue;
    } else {
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

export function scaleNormalizer(rawInput: number, minBufferName: number[], maxBufferName: number[]): number {
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
