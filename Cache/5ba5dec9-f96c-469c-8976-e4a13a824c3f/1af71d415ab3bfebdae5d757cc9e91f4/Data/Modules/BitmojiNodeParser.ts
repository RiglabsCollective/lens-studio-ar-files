export interface BitmojiNodes {
    avatarRoot: SceneObject,
    headJoint: SceneObject,
    neckJoint: SceneObject,
    headGeo: SceneObject,
    headGeoBlend: RenderMeshVisual,
    bodyGeo: SceneObject,
    jawJoint: SceneObject,
    jawEnd: SceneObject,
    leftEyeJoint: SceneObject,
    rightEyeJoint: SceneObject,
    leftEyeBaseJoint: SceneObject,
    rightEyeBaseJoint: SceneObject,
    hairJoint: SceneObject,
    leftShoulderJoint: SceneObject,
    rightShoulderJoint: SceneObject,
    chestJoint: SceneObject,
    tongue001: SceneObject,
    tongue002: SceneObject,
    tongue003: SceneObject,
    tongue004: SceneObject
}

const NODE_LOOKUP = {
    //joints
    'AVATAR':'avatar_root',
    'C_head0001_bind_JNT': 'head_joint',
    'C_head_bind_JNT':'UA_head_joint',
    'C_neck0002_bind_JNT': 'neck_joint',
    'C_jaw_bind_JNT':'UA_jaw_joint',
    'C_jaw0001_bind_JNT': 'jaw_joint',
    'C_jaw0002_bind_JNT': 'jaw_end',

    'L_eye_bind_JNT': 'L_UA_eye_joint',
    'R_eye_bind_JNT': 'R_UA_eye_joint',
    'L_eye_rig_base_JNT': 'L_UA_eye_base_joint',
    'R_eye_rig_base_JNT': 'R_UA_eye_base_joint',
    //geo
    'C_head_GEO': 'head_geo',
    'C_main_GEO': 'body_geo',
    //for dynamic hair
    'C_hair_base_JNT': 'hair_joint',
    'L_clavicle_bind_JNT': 'leftShoulder_joint',
    'R_clavicle_bind_JNT': 'rightShoulder_joint',
    'C_spine0003_bind_JNT': 'chest_joint',
    //tongue
    'C_tongueRootFemale_base_JNT': 'tongueRoot_F_joint',
    'C_tongueFemale_base_JNT': 'tongueBase_F_joint',
    'C_tongueFemale0001_bind_JNT': 'tongue0001_F_joint',
    'C_tongueFemale0002_bind_JNT': 'tongue0002_F_joint',
    'C_tongueFemale0003_bind_JNT': 'tongue0003_F_joint',
    'C_tongueFemale0004_bind_JNT': 'tongue0004_F_joint',

    'C_tongueRootMale_base_JNT': 'tongueRoot_M_joint',
    'C_tongueMale_base_JNT': 'tongueBase_M_joint',
    'C_tongueMale0001_bind_JNT': 'tongue0001_M_joint',
    'C_tongueMale0002_bind_JNT': 'tongue0002_M_joint',
    'C_tongueMale0003_bind_JNT': 'tongue0003_M_joint',
    'C_tongueMale0004_bind_JNT': 'tongue0004_M_joint',
    //UA tongue
    'C_tongue001_bind_JNT': 'tongue001_joint',
    'C_tongue002_bind_JNT': 'tongue002_joint',
    'C_tongue003_bind_JNT': 'tongue003_joint',
    'C_tongue004_bind_JNT': 'tongue004_joint'

};

export function parseBitmojiNodes(so: SceneObject): BitmojiNodes {
    const nodes: BitmojiNodes = {
        avatarRoot: null,
        headJoint: null,
        neckJoint: null,
        headGeo: null,
        headGeoBlend: null,
        bodyGeo: null,
        jawJoint: null,
        jawEnd: null,
        leftEyeJoint: null,
        rightEyeJoint: null,
        leftEyeBaseJoint: null,
        rightEyeBaseJoint: null,
        hairJoint: null,
        leftShoulderJoint: null,
        rightShoulderJoint: null,
        chestJoint: null,
        tongue001: null,
        tongue002: null,
        tongue003: null,
        tongue004: null
    };
    findNodeRecursively(so, nodes);
    return nodes;
}

function findNodeRecursively(so: SceneObject, nodes: BitmojiNodes): void {
    const nodeName = NODE_LOOKUP[so.name];
    if (nodeName) {
        if (nodeName === 'avatar_root') {
            nodes.avatarRoot = so;
        }
        if (nodeName === 'head_joint') {
            nodes.headJoint = so;
        }
        if (nodeName === 'UA_head_joint') {
            nodes.headJoint = so;
        }
        if (nodeName === 'neck_joint') {
            nodes.neckJoint = so;
        }
        if (nodeName === 'head_geo') {
            nodes.headGeo = so;
            nodes.headGeoBlend = so.getComponent('Component.RenderMeshVisual');
            nodes.headGeoBlend.blendNormals = true;
        }
        if (nodeName === 'body_geo') {
            nodes.bodyGeo = so;
        }
        if (nodeName === 'jaw_joint') {
            nodes.jawJoint = so;
        }
        if (nodeName === 'UA_jaw_joint') {
            nodes.jawJoint = so;
        }
        if (nodeName === 'jaw_end') {
            nodes.jawEnd = so;
        }
        if (nodeName === 'L_UA_eye_joint') {
            nodes.leftEyeJoint = so;
        }
        if (nodeName === 'R_UA_eye_joint') {
            nodes.rightEyeJoint = so;
        }
        if (nodeName === 'L_UA_eye_base_joint') {
            nodes.leftEyeBaseJoint = so;
        }
        if (nodeName === 'R_UA_eye_base_joint') {
            nodes.rightEyeBaseJoint = so;
        }
        if (nodeName === 'hair_joint') {
            nodes.hairJoint = so;
        }

        if (nodeName === 'leftShoulder_joint') {
            nodes.leftShoulderJoint = so;
        }
        if (nodeName === 'rightShoulder_joint') {
            nodes.rightShoulderJoint = so;
        }
        if (nodeName === 'chest_joint') {
            nodes.chestJoint = so;
        }
        // UA tongue
        if (nodeName === 'tongue001_joint') {
            nodes.tongue001 = so;
        }
        if (nodeName === 'tongue002_joint') {
            nodes.tongue002 = so;
        }
        if (nodeName === 'tongue003_joint') {
            nodes.tongue003 = so;
        }
        if (nodeName === 'tongue004_joint') {
            nodes.tongue004 = so;
        }
    }

    for (let i = 0; i < so.getChildrenCount(); i++) {
        const child = so.getChild(i);
        findNodeRecursively(child, nodes);
    }
}
