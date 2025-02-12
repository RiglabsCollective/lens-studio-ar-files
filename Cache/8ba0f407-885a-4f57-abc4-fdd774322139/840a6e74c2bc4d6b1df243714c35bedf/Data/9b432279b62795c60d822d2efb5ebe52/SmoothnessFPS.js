"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmoothness = void 0;
const LOW_FPS_RANGE = 25;
const HIGH_FPS_RANGE = 30;
const LOW_FPS_DURATION = 1 / LOW_FPS_RANGE;
const HIGH_FPS_DURATION = 1 / HIGH_FPS_RANGE;
const LOW_FPS_SMOOTH = 1.0;
const HIGH_FPS_SMOOTH = 0.5;
function getSmoothness() {
    const dt = getDeltaTime();
    return MathUtils.clamp(MathUtils.remap(dt, HIGH_FPS_DURATION, LOW_FPS_DURATION, HIGH_FPS_SMOOTH, LOW_FPS_SMOOTH), HIGH_FPS_SMOOTH, LOW_FPS_SMOOTH);
}
exports.getSmoothness = getSmoothness;
//# sourceMappingURL=SmoothnessFPS.js.map