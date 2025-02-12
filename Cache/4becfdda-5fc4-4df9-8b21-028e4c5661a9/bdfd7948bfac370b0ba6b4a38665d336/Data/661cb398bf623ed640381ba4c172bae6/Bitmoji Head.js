"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmojiHead = void 0;
var __selfType = requireType("./Bitmoji Head");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const BitmojiNodeParser_1 = require("./Modules/BitmojiNodeParser");
const TongueChain_1 = require("./Modules/Expressions/TongueChain");
const SmoothnessFPS_1 = require("./Modules/Utils/SmoothnessFPS");
const DestructionHelper_1 = require("./Modules/Scene/DestructionHelper");
const Utills_1 = require("./Modules/Utils/Utills");
const OutputWeights_1 = require("./Modules/Expressions/OutputWeights");
const MathUtills_1 = require("./Modules/Utils/MathUtills");
const Expressions_1 = require("./Modules/Expressions/Expressions");
const EyeTracking_1 = require("./Modules/Expressions/EyeTracking");
const SceneHelper_1 = require("./Modules/Scene/SceneHelper");
var ModelState = MachineLearning.ModelState;
const TARGET_NAMES = [
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
let BitmojiHead = class BitmojiHead extends BaseScriptComponent {
    onAwake() {
        if (!this.validInputs()) {
            return;
        }
        this.createEvent('OnStartEvent').bind(() => this.onStart());
    }
    onStart() {
        const so = this.getSceneObject();
        this.bitmoji3D.onDownloaded.add(() => this.initialize());
        this.occluderSO = this.destructionHelper.instantiatePrefab(this.occluderPrefab, so, 'Occluder');
        this.bitmojiFaceSO = this.destructionHelper.instantiatePrefab(this.bitmojiFacePrefab, so, 'Bitmoji Face');
        this.bitmojiFaceT = this.bitmoji3D.getTransform();
        this.bitmojiFaceInputs = this.bitmojiFaceSO.getComponent('ScriptComponent');
        this.occluderInput = this.occluderSO.getComponent('ScriptComponent');
        this.lightingSO = this.destructionHelper.instantiatePrefab(this.lightingPrefab, so, 'Lighting');
        this.bitmojiFaceInputs.mlController.setCamera(this.camera);
        SceneHelper_1.SceneHelper.setRenderLayerRecursively(so, so.layer);
    }
    validInputs() {
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
    initialize() {
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
        (0, EyeTracking_1.initializeEyeTargets)(this.nodes.leftEyeJoint, this.nodes.rightEyeJoint, this.camera.getSceneObject());
        this.createEvent('UpdateEvent').bind(() => this.onUpdate());
        this.createEvent('OnDestroyEvent').bind(() => this.destructionHelper.destroyObjects());
    }
    initializeBitmojiHead() {
        this.bitmojiParentSO = this.bitmoji3D.getSceneObject();
        this.bitmojiControlT = this.bitmojiParentSO.getChild(0).getTransform();
        this.nodes = (0, BitmojiNodeParser_1.parseBitmojiNodes)(this.bitmojiParentSO);
        this.leftEyeT = this.bitmojiFaceInputs.leftEye.getTransform();
        this.rightEyeT = this.bitmojiFaceInputs.rightEye.getTransform();
        // destroying the body and clothing to leave only the head
        SceneHelper_1.SceneHelper.findChildObjectWithNameRecursively(this.bitmojiParentSO, 'body_GRP').destroy();
        SceneHelper_1.SceneHelper.findChildObjectWithNameRecursively(this.bitmojiParentSO, 'clothes_GRP').destroy();
    }
    initializeFaceFoundEv() {
        const faceFoundEv = this.createEvent('FaceFoundEvent');
        faceFoundEv.bind(() => {
            this.faceTracked = true;
            this.faceFoundTime = getTime();
            if (this.attachToHead) {
                this.bitmojiParentSO.enabled = true;
            }
        });
    }
    initializeFaceLostEv() {
        const faceLostEv = this.createEvent('FaceLostEvent');
        faceLostEv.bind(() => {
            this.faceTracked = false;
            if (this.attachToHead) {
                this.bitmojiParentSO.enabled = false;
            }
        });
    }
    initializeBlenshapes() {
        this.findBlendshapes(this.bitmojiParentSO);
        this.blendshapesC.forEach((mesh) => mesh.meshShadowMode = MeshShadowMode.Caster);
    }
    initializeJoints() {
        this.headT = this.bitmojiFaceInputs.head.getTransform();
        this.headJointT = this.nodes.headJoint.getTransform();
        this.occluderJointT = this.occluderInput.occluderJoint.getTransform();
        this.occluderControlT = this.occluderInput.occluderJoint.getChild(0).getTransform();
        this.outputWeightsController = new OutputWeights_1.OutputWeights(this.bitmojiFaceInputs.head);
        this.jawJointT = this.nodes.jawJoint.getTransform();
        this.leftEyeJointT = this.nodes.leftEyeJoint.getTransform();
        this.rightEyeJointT = this.nodes.rightEyeJoint.getTransform();
        this.headPosition = this.headT.getWorldPosition();
        this.headRotation = this.headT.getLocalRotation().toEulerAngles();
    }
    initializeTongue() {
        this.tongueChain = new TongueChain_1.TongueChain({
            tongueStart: this.nodes.tongue002,
            tongueMid: this.nodes.tongue003,
            tongueEnd: this.nodes.tongue004,
            headJoint: this.nodes.headJoint,
            avatarRoot: this.nodes.avatarRoot
        });
        (0, Expressions_1.initializeTongue)(this.nodes.tongue001, this.nodes.tongue002, this.nodes.tongue003, this.nodes.tongue004);
    }
    initializeLights() {
        const targetLayer = this.getSceneObject().layer;
        for (const child of this.lightingSO.children) {
            child.getComponent('LightSource').renderLayer = targetLayer;
        }
    }
    onUpdate() {
        if (isNull(this.bitmojiFaceInputs.mlController.landmarksLocal) || !this.faceTracked) {
            return;
        }
        this.bitmojiControlT.setLocalPosition(this.CONTROL_LOCAL_POSITION);
        if (this.headBindingReady) {
            this.smoothness = (0, SmoothnessFPS_1.getSmoothness)();
        }
        else {
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
    updateDoubleBlink() {
        const blink_L = this.bitmojiFaceInputs.faceMesh.mesh.control.getExpressionWeightByName('EyeBlinkLeft');
        const blink_R = this.bitmojiFaceInputs.faceMesh.mesh.control.getExpressionWeightByName('EyeBlinkRight');
        if (getTime() - this.firstBlinkStart > this.BLINK_TIME_THRESHOLD && (blink_L >= this.BLINK_EXPRESSION_THRESHOLD || blink_R >= this.BLINK_EXPRESSION_THRESHOLD)) {
            this.firstBlinkStart = getTime();
        }
        else if (getTime() - this.firstBlinkStart > this.BLINK_EXPRESSION_THRESHOLD &&
            getTime() - this.firstBlinkStart <= this.BLINK_TIME_THRESHOLD &&
            getTime() - this.doubleBlinkStart >= this.BLINK_EXPRESSION_THRESHOLD &&
            (blink_L >= this.BLINK_EXPRESSION_THRESHOLD || blink_R >= this.BLINK_EXPRESSION_THRESHOLD)) {
            this.doubleBlinkStart = getTime();
            this.setEyeUpDown = [];
        }
    }
    updateTongueSize() {
        const tongueIn = this.bitmojiFaceInputs.tongueML.getOutput(this.ML_DATA_NAME).data[0] + this.TONGUE_MLOutputFFSET;
        this.tongueSize += tongueIn;
        this.tongueSize = MathUtils.clamp(this.tongueSize, 0.0, this.TONGUE_SIZE_LIMIT);
    }
    updateGlasses() {
        if (this.glassesBucket.length < this.GLASSES_BUCKET_SIZE && this.bitmojiFaceInputs.glassesML.state === ModelState.Idle) {
            this.bitmojiFaceInputs.glassesML.runImmediate(true);
            this.glassesMLRunning = true;
            const glassesRaw = this.bitmojiFaceInputs.glassesML.getOutput(this.ML_DATA_NAME).data[0];
            const glassesAvg = Math.max((0, Utills_1.findAverage)(glassesRaw, this.GLASSES_BUCKET_SIZE, this.glassesBucket), glassesRaw);
            this.wearingGlasses = glassesAvg > this.GLASSES_THRESHOLD;
        }
        if (this.glassesBucket.length >= this.GLASSES_BUCKET_SIZE && this.glassesMLRunning == true) {
            this.bitmojiFaceInputs.glassesML.stop();
            this.glassesMLRunning = false;
        }
    }
    updateHeadPosition() {
        const headRotation = this.headT.getLocalRotation().toEulerAngles();
        const headPosition = this.headT.getWorldPosition();
        this.headRotation = (0, MathUtills_1.normalizeEulerVec)(vec3.lerp(this.headRotation, (0, MathUtills_1.normalizeEulerVec)(headRotation), this.smoothness));
        this.headPosition = vec3.lerp(this.headPosition, headPosition, this.smoothness);
        const activeFaceTime = getTime() - this.faceFoundTime;
        const doubleClickActiveTime = getTime() - this.doubleBlinkStart;
        if (activeFaceTime < this.BUFFER_TIME || doubleClickActiveTime < this.BUFFER_TIME) {
            this.headDefaultValue = this.headValueBuffer[0] = Math.min(Math.max((0, Utills_1.findNeutral)(this.headRotation.x, this.upDownHead), -this.HEAD_NEUTRAL_ROTATION), this.HEAD_NEUTRAL_ROTATION);
        }
        const rotX = MathUtils.clamp((0, MathUtills_1.normalizeEuler)(this.headRotation.y), -this.HEAD_LIMIT.x, this.HEAD_LIMIT.x) * Math.pow(this.outputWeights, 3);
        const rotY = MathUtils.clamp((0, MathUtills_1.normalizeEuler)(this.headRotation.x - this.headDefaultValue), -this.HEAD_LIMIT.y, this.HEAD_LIMIT.y) * Math.pow(this.outputWeights, 3);
        const rotZ = -MathUtils.clamp((0, MathUtills_1.normalizeEuler)(this.headRotation.z), -this.HEAD_LIMIT.z, this.HEAD_LIMIT.z) * Math.pow(this.outputWeights, 3);
        this.headJointT.setLocalRotation(quat.fromEulerVec(new vec3(rotX, rotY, rotZ)));
        this.bitmojiPosition = this.headPosition.add(this.POSITION_OFFSET);
        if (this.attachToHead) {
            this.bitmojiFaceT.setWorldPosition(this.bitmojiPosition);
        }
    }
    updateOccluder() {
        let position = this.bitmojiFaceT.getWorldPosition();
        position = position.add(this.OCCLUDER_POSITION_OFFSET);
        this.occluderJointT.setWorldPosition(position);
        this.occluderJointT.setLocalRotation(this.headJointT.getLocalRotation());
        this.occluderControlT.setWorldRotation(quat.fromEulerVec(vec3.zero()));
    }
    updateFrown() {
        // mouth landmarks
        const lowerLipCenter = this.bitmojiFaceInputs.mlController.landmarksLocal[66];
        const upperLipCenter = this.bitmojiFaceInputs.mlController.landmarksLocal[62];
        const mouthCornerLeft = this.bitmojiFaceInputs.mlController.landmarksLocal[54];
        const mouthCornerRight = this.bitmojiFaceInputs.mlController.landmarksLocal[48];
        const headRotation = this.headT.getLocalRotation().toEulerAngles();
        // calculating frown
        this.frown = (0, MathUtills_1.expCos)(Math.min(3 * Math.max(3 * (mouthCornerLeft.y / 2 + mouthCornerRight.y / 2 -
            Math.max(lowerLipCenter.y, upperLipCenter.y)) + Math.min(2 * (0, MathUtills_1.normalizeEuler)(headRotation.z), 0.1), 0), 1), 1);
    }
    updateExpressions() {
        const useBuffer = (getTime() - this.faceFoundTime) < this.BUFFER_TIME;
        const eyeOutputs = (0, EyeTracking_1.getEyesOutputs)(this.bitmojiFaceInputs.mlController.landmarksLocal, this.leftEyeT, this.rightEyeT, this.leftEyeJointT, this.rightEyeJointT, this.headRotation, this.smoothness, useBuffer, this.doubleBlinkStart, this.wearingGlasses, this.outputWeights, this.headAway, this.setEyeUpDown);
        const outputs = (0, Expressions_1.updateExpressions)(this.bitmojiFaceInputs.mlController.outputData, this.tongueSize, this.smoothness, this.frown, this.headRotation, this.outputWeights, useBuffer, eyeOutputs);
        (0, Expressions_1.updateJaw)(this.jawJointT);
        const tongueControllerEnabled = (0, Expressions_1.isTongueOpen)(this.outputWeights);
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
    applyOutputToBlendshapes(outputs) {
        this.blendshapesC.forEach((mesh) => {
            TARGET_NAMES.forEach((name) => {
                if (mesh.hasBlendShapeWeight('face_shapes.' + name) && !isNull(outputs[name])) {
                    mesh.setBlendShapeWeight('face_shapes.' + name, outputs[name]);
                }
            });
        });
    }
    findBlendshapes(so) {
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
    __initialize() {
        super.__initialize();
        this.ML_DATA_NAME = 'prob';
        this.BUFFER_TIME = 1.5;
        this.HEAD_NEUTRAL_ROTATION = 0.25;
        this.HEAD_LIMIT = new vec3(90.0, 90.0, 90.0);
        this.CONTROL_LOCAL_POSITION = new vec3(0.0, -100.0, 0.0);
        this.BLINK_TIME_THRESHOLD = 2.0;
        this.BLINK_EXPRESSION_THRESHOLD = 0.5;
        this.TONGUE_SIZE_LIMIT = 10.0;
        this.TONGUE_MLOutputFFSET = 0.5;
        this.GLASSES_BUCKET_SIZE = 30;
        this.GLASSES_THRESHOLD = 0.75;
        this.POSITION_OFFSET = new vec3(-100.0, 3.0, 53.0);
        this.OCCLUDER_POSITION_OFFSET = new vec3(0.0, -13.0, -3.0);
        this.destructionHelper = new DestructionHelper_1.DestructionHelper();
        this.tongueSize = 0;
        this.firstBlinkStart = getTime();
        this.doubleBlinkStart = getTime();
        this.setEyeUpDown = [];
        this.glassesBucket = [];
        this.glassesMLRunning = false;
        this.wearingGlasses = false;
        this.outputWeights = 1.0;
        this.smoothness = 1.0;
        this.frown = 0.0;
        this.faceTracked = false;
        this.headRotation = vec3.zero();
        this.headPosition = vec3.zero();
        this.bitmojiPosition = vec3.zero();
        this.faceFoundTime = getTime();
        this.headValueBuffer = [];
        this.upDownHead = [];
        this.blendshapesC = [];
        this.headBindingReady = false;
    }
};
exports.BitmojiHead = BitmojiHead;
exports.BitmojiHead = BitmojiHead = __decorate([
    component
], BitmojiHead);
//# sourceMappingURL=Bitmoji%20Head.js.map