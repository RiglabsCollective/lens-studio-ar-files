export function radiansToDegrees(radians: number): number {
    return radians * MathUtils.RadToDeg;
}

export function degreesToRadians(degrees: number): number {
    return degrees * MathUtils.DegToRad;
}

export function normalizeEuler(radians: number): number {
    let normalizedRad = radians % (2 * Math.PI);

    if (normalizedRad >= Math.PI) {
        normalizedRad -= 2 * Math.PI;
    } else if (normalizedRad < -Math.PI) {
        normalizedRad += 2 * Math.PI;
    }

    return normalizedRad;
}

export function normalizeEulerVec(vec: vec3): vec3 {
    vec.x = normalizeEuler(vec.x);
    vec.y = normalizeEuler(vec.y);
    vec.z = normalizeEuler(vec.z);
    return vec;
}

export function expCos(x: number, power: number): number {
    return (-0.5 * (Math.cos(Math.PI * x) - 1)) ** power;
}

let balloonSize: number = 0;
const balloonOut: number = -0.2;
const balloonMax: number = 2.5;

export function balloon(b_input: number): number {
    if (balloonSize <= balloonMax && balloonSize >= 0) {
        balloonSize += (b_input + balloonOut) * (2 - 2 * (b_input + balloonOut));
    } else if (balloonSize > balloonMax) {
        balloonSize = balloonMax;
    } else {
        balloonSize = 0;
    }
    return balloonSize / balloonMax;
}

export function blendAverage(inputA: number, inputB: number, threshold: number, limit: number) {
    let outputA: number;
    let outputB: number;

    const avg: number = average(inputA, inputB);
    const diffA: number = inputA - avg;
    const diffB: number = inputB - avg;
    const absDiffA: number = Math.abs(diffA);
    const absDiffB: number = Math.abs(diffB);

    if (absDiffA <= threshold) {
        outputA = avg;
    } else if (absDiffA > threshold && absDiffA <= limit) {
        outputA = avg + MathUtils.remap(absDiffA, threshold, limit, 0, diffA);
    } else {
        outputA = inputA;
    }

    if (absDiffB <= threshold) {
        outputB = avg;
    } else if (absDiffB > threshold && absDiffB <= limit) {
        outputB = avg + MathUtils.remap(absDiffB, threshold, limit, 0, diffB);
    } else {
        outputB = inputB;
    }

    return [outputA, outputB];
}

export function average(inputA: number, inputB: number): number {
    return (inputA + inputB) * 0.5;
}
