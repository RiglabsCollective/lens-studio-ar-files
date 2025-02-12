import { BitmojiFaceML } from './BitmojiFaceML';

@component
export class BitmojiFacePrefabInputs extends BaseScriptComponent {
    @input
    readonly faceMesh: RenderMeshVisual;

    @input
    readonly tongueML: MLComponent;

    @input
    readonly glassesML: MLComponent;

    @input
    readonly head: Head;

    @input
    readonly mlController: BitmojiFaceML;

    @input
    readonly leftEye: SceneObject;

    @input
    readonly rightEye: SceneObject;
}
