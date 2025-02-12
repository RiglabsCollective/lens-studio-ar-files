export type Landmark = {
    x: number,
    y: number
}

const MEAN_SHAPE: Landmark[] = [
    { x: -0.499757, y: -0.301018 },
    { x: -0.5, y: -0.170241 },
    { x: -0.488209, y: -0.0381221 },
    { x: -0.46026, y: 0.0922612 },
    { x: -0.408827, y: 0.212332 },
    { x: -0.330849, y: 0.316018 },
    { x: -0.235356, y: 0.402618 },
    { x: -0.128083, y: 0.473003 },
    { x: 0, y: 0.499069 },
    { x: 0.128083, y: 0.473003 },
    { x: 0.235356, y: 0.402618 },
    { x: 0.330849, y: 0.316018 },
    { x: 0.408827, y: 0.212332 },
    { x: 0.46026, y: 0.0922612 },
    { x: 0.488209, y: -0.0381221 },
    { x: 0.5, y: -0.170241 },
    { x: 0.499757, y: -0.301018 },
    { x: -0.410146, y: -0.42043 },
    { x: -0.360232, y: -0.474949 },
    { x: -0.281798, y: -0.499069 },
    { x: -0.192289, y: -0.49134 },
    { x: -0.106776, y: -0.468519 },
    { x: 0.106776, y: -0.468519 },
    { x: 0.192289, y: -0.49134 },
    { x: 0.281798, y: -0.499069 },
    { x: 0.360232, y: -0.474949 },
    { x: 0.410146, y: -0.42043 },
    { x: 0, y: -0.336655 },
    { x: 0, y: -0.254715 },
    { x: 0, y: -0.173906 },
    { x: 0, y: -0.0919155 },
    { x: -0.107867, y: -0.00810091 },
    { x: -0.0566312, y: 0.00698954 },
    { x: 0, y: 0.0164446 },
    { x: 0.0566312, y: 0.00698954 },
    { x: 0.107867, y: -0.00810091 },
    { x: -0.30982, y: -0.317148 },
    { x: -0.25848, y: -0.346273 },
    { x: -0.189803, y: -0.346541 },
    { x: -0.134214, y: -0.31066 },
    { x: -0.191745, y: -0.29453 },
    { x: -0.259605, y: -0.294605 },
    { x: 0.134214, y: -0.31066 },
    { x: 0.189803, y: -0.346541 },
    { x: 0.25848, y: -0.346273 },
    { x: 0.30982, y: -0.317148 },
    { x: 0.259605, y: -0.294605 },
    { x: 0.191745, y: -0.29453 },
    { x: -0.188902, y: 0.150795 },
    { x: -0.125312, y: 0.11567 },
    { x: -0.0532151, y: 0.0947883 },
    { x: 0, y: 0.106207 },
    { x: 0.0532151, y: 0.0947883 },
    { x: 0.125312, y: 0.11567 },
    { x: 0.188902, y: 0.150795 },
    { x: 0.128334, y: 0.217719 },
    { x: 0.0579649, y: 0.252652 },
    { x: 0, y: 0.25957 },
    { x: -0.0579649, y: 0.252652 },
    { x: -0.128334, y: 0.217719 },
    { x: -0.172106, y: 0.152502 },
    { x: -0.0535376, y: 0.143246 },
    { x: 0, y: 0.147992 },
    { x: 0.0535376, y: 0.143246 },
    { x: 0.172106, y: 0.152502 },
    { x: 0.0541128, y: 0.182291 },
    { x: 0, y: 0.188314 },
    { x: -0.0541128, y: 0.182291 }
];

@component
export class BitmojiFaceML extends BaseScriptComponent {
    @input
    private readonly ml: MLComponent;

    @input
    private readonly head: Head;

    @input
    private readonly deviceTexture: Texture;

    private camera: Camera;

    outputData: Float32Array;
    landmarksLocal: Landmark[];
    modelName: string;

    private readonly INPUT_NAME: string = 'landmarks+camera';
    private readonly OUTPUT_NAME: string = 'predictions';

    private inputData: Float32Array;

    onAwake() {
        this.modelName = this.ml.model.name;
    }

    setCamera(camera: Camera): void {
        this.camera = camera;
        this.initialize();
    }

    private initialize(): void {
        this.ml.onLoadingFinished = () => this.onLoadingFinished();
        this.ml.build([]);
        this.createEvent('UpdateEvent').bind(() => {
            if (this.ml.state !== MachineLearning.ModelState.Idle) {
                return;
            }
            this.ml.runImmediate(true);
            if (this.outputData) {
                for (let i = 0; i < 51; i++) {
                    this.outputData[i] = Math.log(1 + Math.exp(this.outputData[i]));
                }
            }
        });
    }

    private onLoadingFinished(): void {
        this.inputData = this.ml.getInput(this.INPUT_NAME).data;
        this.outputData = this.ml.getOutput(this.OUTPUT_NAME).data;
        this.ml.onRunningFinished = () => this.onRunningFinished();
    }

    private onRunningFinished(): void {
        if (this.head.getFacesCount() <= this.head.faceIndex) {
            return;
        }
        const landmarks: vec2[] = this.head.getLandmarks();
        const width: number = this.deviceTexture.getWidth();
        const height: number = this.deviceTexture.getHeight();
        for (const i in landmarks) {
            landmarks[i].x = landmarks[i].x * width;
            landmarks[i].y = landmarks[i].y * height;
        }
        const principalPoint: Landmark = { x: (width - 1) * 0.5, y: (height - 1) * 0.5 };
        const focalLength: number = Math.max(width, height) * 0.5 / Math.tan(this.camera.fov * 0.5);
        const toLocal = this.fitSimilarityTransform(MEAN_SHAPE, landmarks, 1.0);
        const landmarksLocal: Landmark[] = [];
        for (let i = 0; i < landmarks.length; ++i) {
            landmarksLocal.push(this.dividePoint(this.subtractPoint(landmarks[i], toLocal[1]), toLocal[0]));
        }
        const principalPointLocal: Landmark = this.dividePoint(this.subtractPoint(principalPoint, toLocal[1]), toLocal[0]);
        const focalLengthLocal: number = focalLength / Math.sqrt(toLocal[0].x * toLocal[0].x + toLocal[0].y * toLocal[0].y);

        for (let i = 0; i < landmarksLocal.length; ++i) {
            this.inputData[2 * i] = landmarksLocal[i].x;
            this.inputData[2 * i + 1] = landmarksLocal[i].y;
        }
        this.landmarksLocal = landmarksLocal;
        this.inputData[this.inputData.length - 3] = 1.0 / focalLengthLocal;
        this.inputData[this.inputData.length - 2] = Math.atan2(principalPointLocal.x, focalLengthLocal);
        this.inputData[this.inputData.length - 1] = Math.atan2(principalPointLocal.y, focalLengthLocal);
    }

    private fitSimilarityTransform(meanShape: Landmark[], landmarks: vec2[], weight): Landmark[] {
        const h_: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i: number = 0; i < meanShape.length; ++i) {
            h_[0] += weight;
            h_[1] += weight * (meanShape[i].x * meanShape[i].x + meanShape[i].y * meanShape[i].y);
            h_[2] += weight * meanShape[i].x;
            h_[3] += weight * meanShape[i].y;
            h_[4] += weight * landmarks[i].x;
            h_[5] += weight * landmarks[i].y;
            h_[6] += weight * (meanShape[i].x * landmarks[i].x + meanShape[i].y * landmarks[i].y);
            h_[7] += weight * (meanShape[i].x * landmarks[i].y - meanShape[i].y * landmarks[i].x);
        }

        const c: number = 1 / (h_[0] * h_[1] - h_[2] * h_[2] - h_[3] * h_[3]);
        const d: number = 1 / h_[0];
        const ax: number = (h_[0] * h_[6] - h_[2] * h_[4] - h_[3] * h_[5]) * c;
        const ay: number = (h_[0] * h_[7] - h_[2] * h_[5] + h_[3] * h_[4]) * c;
        const bx: number = (h_[4] - ax * h_[2] + ay * h_[3]) * d;
        const by: number = (h_[5] - ax * h_[3] - ay * h_[2]) * d;

        return [{ x: ax, y: ay }, { x: bx, y: by }];
    }

    private dividePoint(a: Landmark, b: Landmark): Landmark {
        const normInv2: number = 1.0 / (b.x * b.x + b.y * b.y);
        return { x: (a.x * b.x + a.y * b.y) * normInv2, y: (a.y * b.x - a.x * b.y) * normInv2 };
    }

    private subtractPoint(a: Landmark, b: Landmark): Landmark {
        return { x: a.x - b.x, y: a.y - b.y };
    }
}
