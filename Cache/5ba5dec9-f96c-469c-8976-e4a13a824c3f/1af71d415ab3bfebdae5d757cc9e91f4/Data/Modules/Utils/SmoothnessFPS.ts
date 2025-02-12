const LOW_FPS_RANGE: number = 25;
const HIGH_FPS_RANGE: number = 30;
const LOW_FPS_DURATION: number = 1 / LOW_FPS_RANGE;
const HIGH_FPS_DURATION: number = 1 / HIGH_FPS_RANGE;
const LOW_FPS_SMOOTH: number = 1.0;
const HIGH_FPS_SMOOTH: number = 0.5;

export function getSmoothness(): number {
    const dt: number = getDeltaTime();
    return MathUtils.clamp(MathUtils.remap(dt,
        HIGH_FPS_DURATION,
        LOW_FPS_DURATION,
        HIGH_FPS_SMOOTH,
        LOW_FPS_SMOOTH), HIGH_FPS_SMOOTH, LOW_FPS_SMOOTH);
}
