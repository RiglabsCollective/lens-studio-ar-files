import { Bitmoji3D } from './Declaration/Bitmoji3D';
import { BitmojiNodes, parseBitmojiNodes } from './Modules/BitmojiNodeParser';
import { TongueChain } from './Modules/Expressions/TongueChain';
import { getSmoothness } from './Modules/Utils/SmoothnessFPS';
import { DestructionHelper } from './Modules/Scene/DestructionHelper';
import { findAverage, findNeutral } from './Modules/Utils/Utills';
import { OutputWeights } from './Modules/Expressions/OutputWeights';
import { expCos, normalizeEuler, normalizeEulerVec } from './Modules/Utils/MathUtills';
import { initializeTongue, isTongueOpen, updateExpressions, updateJaw } from './Modules/Expressions/Expressions';
import { EyeOutputs, getEyesOutputs, initializeEyeTargets } from './Modules/Expressions/EyeTracking';
import { SceneHelper } from './Modules/Scene/SceneHelper';
import { BitmojiFacePrefabInputs } from './Prefabs/Scripts/BitmojiFacePrefabInputs';
import { OccluderPrefabInputs } from './Prefabs/Scripts/OccluderPrefabInputs';
import ModelState = MachineLearning.ModelState;

const TARGET_NAMES: string[] = [
    'ai_browDown_L',
    'ai_browDown_R',
    'ai_browInnerDn_L',
    'ai_browInnerDn_R',
    'ai_browInnerIn_L',
    'ai_browInnerIn_R',
    'ai_browInnerUp_L',
    'ai_browInnerUp_R',
    'ai_browMidDown_L',
    'ai_browMidDown_R',
    'ai_browMidUp_L',
    'ai_browMidUp_R',
    'ai_browOuterUp_L',
    'ai_browOuterUp_R',
    'ai_browUp_L',
    'ai_browUp_R',
    'ai_cheekPuff_L',
    'ai_cheekPuff_R',
    'ai_cheekSquint_L',
    'ai_cheekSquint_R',
    'ai_lipLowerUp_C',
    'ai_lipLowerUp_L',
    'ai_lipLowerUp_R',
    'ai_lipLowerWide_L',
    'ai_lipLowerWide_R',
    'ai_lipLower_C',
    'ai_lipLower_L',
    'ai_lipLower_R',
    'ai_lipUpperDown_C',
    'ai_lipUpperDown_L',
    'ai_lipUpperDown_R',
    'ai_lipUpperWide_L',
    'ai_lipUpperWide_R',
    'ai_lipUpper_C',
    'ai_lipUpper_L',
    'ai_lipUpper_R',
    'ai_mouthDimple_L',
    'ai_mouthDimple_R',
    'ai_mouthDn',
    'ai_mouthFrown_L',
    'ai_mouthFrown_R',
    'ai_mouthIn_L',
    'ai_mouthIn_R',
    'ai_mouthLeft',
    'ai_mouthOut',
    'ai_mouthRight',
    'ai_mouthRollLower',
    'ai_mouthRollUpper',
    'ai_mouthShrugLower',
    'ai_mouthShrugUpper',
    'ai_mouthSmile_L',
    'ai_mouthSmile_R',
    'ai_mouthStretch_L',
    'ai_mouthStretch_R',
    'ai_mouthUp',
    'ai_mouthUpperDown',
    'ai_neutral',
    'ai_noseSneer_L',
    'ai_noseSneer_R',
    'ca_lipCornerPinch_L',
    'ca_lipCornerPinch_R',
    'ca_lipCornerRound_L',
    'ca_lipCornerRound_R',
    'ca_lipCornerSmile_L',
    'ca_lipCornerSmile_R',
    'ai_eyeInUpperClose_L',
    'ai_eyeInUpperClose_R',
    'ai_eyeIrisDown_L',
    'ai_eyeIrisDown_R',
    'ai_eyeIrisIn_L',
    'ai_eyeIrisIn_R',
    'ai_eyeIrisOut_L',
    'ai_eyeIrisOut_R',
    'ai_eyeIrisUp_L',
    'ai_eyeIrisUp_R',
    'ai_eyeLowerClose_25_L',
    'ai_eyeLowerClose_25_R',
    'ai_eyeLowerClose_50_L',
    'ai_eyeLowerClose_50_R',
    'ai_eyeLowerClose_75_L',
    'ai_eyeLowerClose_75_R',
    'ai_eyeLowerClose_L',
    'ai_eyeLowerClose_R',
    'ai_eyeLowerSmile_L',
    'ai_eyeLowerSmile_R',
    'ai_eyeLowerWide_L',
    'ai_eyeLowerWide_R',
    'ai_eyeOutUpperClose_L',
    'ai_eyeOutUpperClose_R',
    'ai_eyeUpperClose_25_L',
    'ai_eyeUpperClose_25_R',
    'ai_eyeUpperClose_50_L',
    'ai_eyeUpperClose_50_R',
    'ai_eyeUpperClose_75_L',
    'ai_eyeUpperClose_75_R',
    'ai_eyeUpperClose_L',
    'ai_eyeUpperClose_R',
    'ai_eyeUpperWide_L',
    'ai_eyeUpperWide_R'
];

@component
export class BitmojiHead extends BaseScriptComponent {
    @input('Component.ScriptComponent')
    @label('Bitmoji 3D')
    @allowUndefined
    private readonly bitmoji3D: Bitmoji3D;

    @input
    @allowUndefined
    private readonly camera: Camera;

    @ui.separator

    @input
    private readonly attachToHead: boolean;

    @input
    @showIf('attachToHead', false)
    private readonly rotateHead: boolean;

    @input
    private readonly bitmojiFacePrefab: ObjectPrefab;

    @input
    private readonly lightingPrefab: ObjectPrefab;

    @input
    private readonly occluderPrefab: ObjectPrefab;

    private readonly ML_DATA_NAME: string = 'prob';

    private readonly BUFFER_TIME: number = 1.5;
    private HEAD_NEUTRAL_ROTATION: number = 0.25;
    private readonly HEAD_LIMIT: vec3 = new vec3(90.0, 90.0, 90.0);
    private readonly CONTROL_LOCAL_POSITION: vec3 = new vec3(0.0, -100.0, 0.0);

    private readonly BLINK_TIME_THRESHOLD: number = 2.0;
    private readonly BLINK_EXPRESSION_THRESHOLD: number = 0.5;

    private readonly TONGUE_SIZE_LIMIT: number = 10.0;
    private readonly TONGUE_MLOutputFFSET: number = 0.5;

    private readonly GLASSES_BUCKET_SIZE: number = 30;
    private readonly GLASSES_THRESHOLD: number = 0.75;

    private readonly POSITION_OFFSET: vec3 = new vec3(-100.0, 3.0, 53.0);
    private readonly OCCLUDER_POSITION_OFFSET: vec3 = new vec3(0.0, -13.0, -3.0);

    private readonly destructionHelper: DestructionHelper = new DestructionHelper();

    private bitmojiParentSO: SceneObject;
    private bitmojiControlT: Transform;
    private nodes: BitmojiNodes;

    private tongueChain: TongueChain;
    private tongueSize: number = 0;

    private firstBlinkStart: number = getTime();
    private doubleBlinkStart: number = getTime();
    private setEyeUpDown: number[] = [];

    private glassesBucket: number[] = [];
    private glassesMLRunning: boolean = false;
    private wearingGlasses: boolean = false;

    private outputWeightsController: OutputWeights;
    private outputWeights: number = 1.0;

    private smoothness: number = 1.0;
    private frown: number = 0.0;

    private bitmojiFaceSO: SceneObject;
    private bitmojiFaceInputs: BitmojiFacePrefabInputs;
    private lightingSO: SceneObject;
    private occluderSO: SceneObject;
    private occluderInput: OccluderPrefabInputs;

    private faceTracked: boolean = false;

    private bitmojiFaceT: Transform;
    private headT: Transform;
    private headJointT: Transform;
    private occluderJointT: Transform;
    private occluderControlT: Transform;
    private jawJointT: Transform;
    private leftEyeT: Transform;
    private rightEyeT: Transform;
    private leftEyeJointT: Transform;
    private rightEyeJointT: Transform;

    private headRotation: vec3 = vec3.zero();
    private headPosition: vec3 = vec3.zero();
    private bitmojiPosition: vec3 = vec3.zero();

    private faceFoundTime: number = getTime();

    private headDefaultValue: number;
    private headValueBuffer: number[] = [];
    private upDownHead: number[] = [];

    private headAway: number;

    private blendshapesC: RenderMeshVisual[] = [];
    
    private headBindingReady: boolean = false;

    onAwake() {
        if (!this.validInputs()) {
            return;
        }
        this.createEvent('OnStartEvent').bind(() => this.onStart());
    }
    
    private onStart(): void {
        const so: SceneObject = this.getSceneObject();
        this.bitmoji3D.onDownloaded.add(() => this.initialize());
        this.occluderSO = this.destructionHelper.instantiatePrefab(this.occluderPrefab, so, 'Occluder');
        this.bitmojiFaceSO = this.destructionHelper.instantiatePrefab(this.bitmojiFacePrefab, so, 'Bitmoji Face');
        this.bitmojiFaceT = this.bitmoji3D.getTransform();
        this.bitmojiFaceInputs = this.bitmojiFaceSO.getComponent('ScriptComponent') as BitmojiFacePrefabInputs;
        this.occluderInput = this.occluderSO.getComponent('ScriptComponent') as OccluderPrefabInputs;
        this.lightingSO = this.destructionHelper.instantiatePrefab(this.lightingPrefab, so, 'Lighting');
        this.bitmojiFaceInputs.mlController.setCamera(this.camera);
        SceneHelper.setRenderLayerRecursively(so, so.layer);
    }

    private validInputs(): boolean {
        if (isNull(this.bitmoji3D)) {
            print("Warning! Bitmoji 3D input is empty.");
            return false;
        }
        if (isNull(this.camera)) {
            print("Warning! Camera input is empty.");
            return false;
        }
        return true;
    }

    private initialize(): void {
        this.initializeBitmojiHead();
        if (isNull(this.nodes.headJoint)) {
            print('Invalid Bitmoji head');
            return;
        }
        this.initializeFaceFoundEv();
        this.initializeFaceLostEv();
        this.initializeLights();
        this.initializeBlenshapes();
        this.initializeJoints();
        this.initializeTongue();
        initializeEyeTargets(this.nodes.leftEyeJoint, this.nodes.rightEyeJoint, this.camera.getSceneObject());
        this.createEvent('UpdateEvent').bind(() => this.onUpdate());
        this.createEvent('OnDestroyEvent').bind(() => this.destructionHelper.destroyObjects());
    }

    private initializeBitmojiHead(): void {
        this.bitmojiParentSO = this.bitmoji3D.getSceneObject();
        this.bitmojiControlT = this.bitmojiParentSO.getChild(0).getTransform();
        this.nodes = parseBitmojiNodes(this.bitmojiParentSO);
        this.leftEyeT = this.bitmojiFaceInputs.leftEye.getTransform();
        this.rightEyeT = this.bitmojiFaceInputs.rightEye.getTransform();

        // destroying the body and clothing to leave only the head
        SceneHelper.findChildObjectWithNameRecursively(this.bitmojiParentSO, 'body_GRP').destroy();
        SceneHelper.findChildObjectWithNameRecursively(this.bitmojiParentSO, 'clothes_GRP').destroy();
    }

    private initializeFaceFoundEv(): void {
        const faceFoundEv = this.createEvent('FaceFoundEvent');
        faceFoundEv.bind(() => {
            this.faceTracked = true;
            this.faceFoundTime = getTime();
            if (this.attachToHead) {
                this.bitmojiParentSO.enabled = true;
            }
        });
    }

    private initializeFaceLostEv(): void {
        const faceLostEv =  this.createEvent('FaceLostEvent');
        faceLostEv.bind(() => {
            this.faceTracked = false;
            if (this.attachToHead) {
                this.bitmojiParentSO.enabled = false;
            }
        });
    }

    private initializeBlenshapes(): void {
        this.findBlendshapes(this.bitmojiParentSO);
        this.blendshapesC.forEach((mesh: RenderMeshVisual) => mesh.meshShadowMode = MeshShadowMode.Caster);
    }

    private initializeJoints(): void {
        this.headT = this.bitmojiFaceInputs.head.getTransform();
        this.headJointT = this.nodes.headJoint.getTransform();
        this.occluderJointT = this.occluderInput.occluderJoint.getTransform();
        this.occluderControlT = this.occluderInput.occluderJoint.getChild(0).getTransform();
        this.outputWeightsController = new OutputWeights(this.bitmojiFaceInputs.head);
        this.jawJointT = this.nodes.jawJoint.getTransform();
        this.leftEyeJointT = this.nodes.leftEyeJoint.getTransform();
        this.rightEyeJointT = this.nodes.rightEyeJoint.getTransform();
        this.headPosition = this.headT.getWorldPosition();
        this.headRotation = this.headT.getLocalRotation().toEulerAngles();
    }

    private initializeTongue(): void {
        this.tongueChain = new TongueChain({
            tongueStart: this.nodes.tongue002,
            tongueMid: this.nodes.tongue003,
            tongueEnd: this.nodes.tongue004,
            headJoint: this.nodes.headJoint,
            avatarRoot: this.nodes.avatarRoot
        });
        initializeTongue(this.nodes.tongue001, this.nodes.tongue002, this.nodes.tongue003, this.nodes.tongue004);
    }

    private initializeLights(): void {
        const targetLayer: LayerSet = this.getSceneObject().layer;
        for (const child of this.lightingSO.children) {
            child.getComponent('LightSource').renderLayer = targetLayer;
        }
    }

    private onUpdate(): void {
        if (isNull(this.bitmojiFaceInputs.mlController.landmarksLocal) || !this.faceTracked) {
            return;
        }
        this.bitmojiControlT.setLocalPosition(this.CONTROL_LOCAL_POSITION);
        if (this.headBindingReady) {
            this.smoothness = getSmoothness(); 
        } else {
            this.headBindingReady = true;
            this.smoothness = 1.0;
        }
               
        
        this.updateTongueSize();
        this.updateDoubleBlink();
        this.updateGlasses();
        [this.outputWeights, this.headAway] = this.outputWeightsController.getWeights(this.faceTracked);
        if (this.attachToHead || this.rotateHead) {
            this.updateHeadPosition();
        }
        this.updateOccluder();
        this.updateFrown();
        this.updateExpressions();
    }

    private updateDoubleBlink(): void {
        const blink_L: number = (this.bitmojiFaceInputs.faceMesh.mesh.control as FaceRenderObjectProvider).getExpressionWeightByName('EyeBlinkLeft');
        const blink_R: number = (this.bitmojiFaceInputs.faceMesh.mesh.control as FaceRenderObjectProvider).getExpressionWeightByName('EyeBlinkRight');
        if (getTime() - this.firstBlinkStart > this.BLINK_TIME_THRESHOLD && (blink_L >= this.BLINK_EXPRESSION_THRESHOLD || blink_R >= this.BLINK_EXPRESSION_THRESHOLD)) {
            this.firstBlinkStart = getTime();
        } else if (getTime() - this.firstBlinkStart > this.BLINK_EXPRESSION_THRESHOLD &&
                getTime() - this.firstBlinkStart <= this.BLINK_TIME_THRESHOLD &&
                getTime() - this.doubleBlinkStart >= this.BLINK_EXPRESSION_THRESHOLD &&
                (blink_L >= this.BLINK_EXPRESSION_THRESHOLD || blink_R >= this.BLINK_EXPRESSION_THRESHOLD)) {
            this.doubleBlinkStart = getTime();
            this.setEyeUpDown = [];
        }
    }

    private updateTongueSize(): void {
        const tongueIn: number = this.bitmojiFaceInputs.tongueML.getOutput(this.ML_DATA_NAME).data[0] + this.TONGUE_MLOutputFFSET;
        this.tongueSize += tongueIn;
        this.tongueSize = MathUtils.clamp(this.tongueSize, 0.0, this.TONGUE_SIZE_LIMIT);
    }

    private updateGlasses(): void {
        if (this.glassesBucket.length < this.GLASSES_BUCKET_SIZE && this.bitmojiFaceInputs.glassesML.state === ModelState.Idle) {
            this.bitmojiFaceInputs.glassesML.runImmediate(true);
            this.glassesMLRunning = true;
            const glassesRaw: number = this.bitmojiFaceInputs.glassesML.getOutput(this.ML_DATA_NAME).data[0];
            const glassesAvg: number = Math.max(findAverage(glassesRaw, this.GLASSES_BUCKET_SIZE, this.glassesBucket), glassesRaw);
            this.wearingGlasses = glassesAvg > this.GLASSES_THRESHOLD;
        }

        if (this.glassesBucket.length >= this.GLASSES_BUCKET_SIZE && this.glassesMLRunning == true) {
            this.bitmojiFaceInputs.glassesML.stop();
            this.glassesMLRunning = false;
        }
    }

    private updateHeadPosition(): void {
        const headRotation: vec3 = this.headT.getLocalRotation().toEulerAngles();
        const headPosition: vec3 = this.headT.getWorldPosition();

        this.headRotation = normalizeEulerVec(vec3.lerp(this.headRotation, normalizeEulerVec(headRotation), this.smoothness));
        this.headPosition = vec3.lerp(this.headPosition, headPosition, this.smoothness);
        const activeFaceTime: number = getTime() - this.faceFoundTime;
        const doubleClickActiveTime: number = getTime() - this.doubleBlinkStart;

        if (activeFaceTime < this.BUFFER_TIME || doubleClickActiveTime < this.BUFFER_TIME) {
            this.headDefaultValue = this.headValueBuffer[0] = Math.min(Math.max(findNeutral(this.headRotation.x, this.upDownHead),
                -this.HEAD_NEUTRAL_ROTATION), this.HEAD_NEUTRAL_ROTATION);
        }

        const rotX: number = MathUtils.clamp(normalizeEuler(this.headRotation.y),
            -this.HEAD_LIMIT.x,
            this.HEAD_LIMIT.x) * Math.pow(this.outputWeights, 3);

        const rotY: number  = MathUtils.clamp(normalizeEuler(this.headRotation.x - this.headDefaultValue),
            -this.HEAD_LIMIT.y,
            this.HEAD_LIMIT.y) * Math.pow(this.outputWeights, 3);

        const rotZ: number  = -MathUtils.clamp(normalizeEuler(this.headRotation.z),
            -this.HEAD_LIMIT.z,
            this.HEAD_LIMIT.z) * Math.pow(this.outputWeights, 3);

        this.headJointT.setLocalRotation(quat.fromEulerVec(new vec3(rotX, rotY, rotZ)));

        this.bitmojiPosition = this.headPosition.add(this.POSITION_OFFSET);

        if (this.attachToHead) {
            this.bitmojiFaceT.setWorldPosition(this.bitmojiPosition);
        }
    }

    private updateOccluder(): void {
        let position: vec3 = this.bitmojiFaceT.getWorldPosition();
        position = position.add(this.OCCLUDER_POSITION_OFFSET);
        this.occluderJointT.setWorldPosition(position);
        this.occluderJointT.setLocalRotation(this.headJointT.getLocalRotation());
        this.occluderControlT.setWorldRotation(quat.fromEulerVec(vec3.zero()));
    }

    private updateFrown(): void {
        // mouth landmarks
        const lowerLipCenter = this.bitmojiFaceInputs.mlController.landmarksLocal[66];
        const upperLipCenter = this.bitmojiFaceInputs.mlController.landmarksLocal[62];
        const mouthCornerLeft = this.bitmojiFaceInputs.mlController.landmarksLocal[54];
        const mouthCornerRight = this.bitmojiFaceInputs.mlController.landmarksLocal[48];

        const headRotation = this.headT.getLocalRotation().toEulerAngles();
        // calculating frown
        this.frown = expCos(Math.min(3 * Math.max(3 * (mouthCornerLeft.y / 2 + mouthCornerRight.y / 2 -
            Math.max(lowerLipCenter.y, upperLipCenter.y)) + Math.min(2 * normalizeEuler(headRotation.z), 0.1), 0), 1), 1);
    }

    private updateExpressions(): void {
        const useBuffer: boolean = (getTime() - this.faceFoundTime) < this.BUFFER_TIME;
        const eyeOutputs: EyeOutputs = getEyesOutputs(this.bitmojiFaceInputs.mlController.landmarksLocal, this.leftEyeT, this.rightEyeT, this.leftEyeJointT, this.rightEyeJointT, this.headRotation, this.smoothness, useBuffer, this.doubleBlinkStart, this.wearingGlasses, this.outputWeights, this.headAway, this.setEyeUpDown);

        const outputs = updateExpressions(this.bitmojiFaceInputs.mlController.outputData, this.tongueSize, this.smoothness, this.frown, this.headRotation, this.outputWeights, useBuffer, eyeOutputs);

        updateJaw(this.jawJointT);
        const tongueControllerEnabled: boolean  = isTongueOpen(this.outputWeights);
        if (tongueControllerEnabled) {
            this.tongueChain.update();
        }
        if (!isNull(this.nodes.headGeoBlend)) {
            this.applyOutputToBlendshapes(outputs);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookUpLeft', eyeOutputs.EyeUpLeftOutput * this.outputWeights);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookUpRight', eyeOutputs.EyeUpRightOutput * this.outputWeights);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookDownLeft', eyeOutputs.EyeDownLeftOutput * this.outputWeights);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookDownRight', eyeOutputs.EyeDownRightOutput * this.outputWeights);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookOutRight', eyeOutputs.EyeOutRightOutput * this.outputWeights);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookInLeft', eyeOutputs.EyeInLeftOutput * this.outputWeights);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookOutLeft', eyeOutputs.EyeOutLeftOutput * this.outputWeights);
            this.nodes.headGeoBlend.setBlendShapeWeight('face_shapes.ti_eyeLookInRight', eyeOutputs.EyeInRightOutput * this.outputWeights);
        }
    }

    private applyOutputToBlendshapes(outputs: {}): void {
        this.blendshapesC.forEach((mesh) => {
            TARGET_NAMES.forEach((name) => {
                if (mesh.hasBlendShapeWeight('face_shapes.' + name) && !isNull(outputs[name])) {
                    mesh.setBlendShapeWeight('face_shapes.' + name, outputs[name]);
                }
            });
        });
    }

    private findBlendshapes(so: SceneObject): void {
        const renderMesh = so.getComponent('RenderMeshVisual');
        if (!isNull(renderMesh)) {
            for (let i = 0; i < TARGET_NAMES.length; i++) {
                if (renderMesh.hasBlendShapeWeight('face_shapes.' + TARGET_NAMES[i])) {
                    this.blendshapesC.push(renderMesh);
                    break;
                }
            }
        }
        so.children.forEach((child) => this.findBlendshapes(child));
    }
}
