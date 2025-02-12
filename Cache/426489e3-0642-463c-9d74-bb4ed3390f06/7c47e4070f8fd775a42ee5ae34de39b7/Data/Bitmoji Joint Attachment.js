//@input Component.ScriptComponent bitmoji
//@input string jointName = "Head" {"widget":"combobox", "values":[{"label":"Hips", "value":"Hips"}, {"label":"Neck", "value":"Neck"}, {"label":"Head", "value":"Head"}, {"label":"RightShoulder", "value":"RightShoulder"}, {"label":"RightArm", "value":"RightArm"}, {"label":"RightHand", "value":"RightHand"}, {"label":"LeftShoulder", "value":"LeftShoulder"}, {"label":"LeftArm", "value":"LeftArm"}, {"label":"LeftHand", "value":"LeftHand"}, {"label":"LeftLeg", "value":"LeftLeg"}, {"label":"LeftFoot", "value":"LeftFoot"}, {"label":"RightLeg", "value":"RightLeg"}, {"label":"RightFoot", "value":"RightFoot"}]}
//@ui {"widget":"separator"}
//@input string objectToAttach = objectPrefab  {"widget":"combobox", "values":[{"label":"Scene Object", "value":"sceneObject"}, {"label":"Object Prefab", "value":"objectPrefab"}]}
//@input SceneObject object {"showIf":"objectToAttach", "showIfValue":"sceneObject"}
//@input Asset.ObjectPrefab prefab {"showIf":"objectToAttach", "showIfValue":"objectPrefab"}
//@ui {"widget":"group_start", "showIf":"objectToAttach", "showIfValue":"objectPrefab"}
//@input vec3 positionOffset 
//@input vec3 objectScale = {1,1,1}
//@input vec3 rotationOffset
//@input bool hasAnimation
//@input Component.AnimationPlayer animationPlayer {"showIf":"hasAnimation", "showIfValue":"true"}
//@input bool playAnimationOnLoad {"showIf":"hasAnimation", "showIfValue":"true"}
//@ui {"widget":"group_end"}


const bitmojiJointMap = {
    'ROOT': "Hips",
    'C_neck0001_bind_JNT': "Neck",
    'C_head_bind_JNT': "Head",
    'R_clavicle_bind_JNT': "RightShoulder",
    'R_armUpper0001_bind_JNT': "RightArm",
    'R_hand0001_bind_JNT': "RightHand",
    'L_clavicle_bind_JNT': "LeftShoulder",
    'L_armUpper0001_bind_JNT': "LeftArm",
    'L_hand0001_bind_JNT': "LeftHand",
    'L_legLower0001_bind_JNT': "LeftLeg",
    'L_foot0001_bind_JNT': "LeftFoot",
    'R_legLower0001_bind_JNT': "RightLeg",
    'R_foot0001_bind_JNT': "RightFoot",
};

const defaultRotOffsetsMap = {
    "RightHand": new vec3(0,0,180),
    "LeftHand": new vec3(0,0,0),
    "Head": new vec3(0,0,-90),
    "Hips": new vec3(90,0,0),
    "LeftFoot": new vec3(-90,0,0),
    "RightFoot": new vec3(90,0,0),
    "Neck": new vec3 (-90,0,0),
    "LeftShoulder":new vec3 (180,0,0),
    "LeftArm":new vec3 (180,0,0),
    "RightShoulder":new vec3 (0,0,0),
    "RightArm":new vec3 (0,0,0),
    "LeftLeg":new vec3 (-90,0.0,0),
    "RightLeg":new vec3 (90,0.0,0),
    
}
const defaultOffsetsMap = {
    "RightHand": new vec3(-0.06,-0.08,0.0),
    "LeftHand": new vec3(0.06,0.08,0.0),
    "Head": new vec3(0.4,0.0,0.0),
    "Hips": new vec3(0,0,0.14),
    "LeftFoot": new vec3(0.05,0,0.0),
    "RightFoot": new vec3(-0.05,0,0),
    "Neck": new vec3 (0,0,-0.08),
    "LeftShoulder":new vec3 (0,-0.06,0),
    "LeftArm":new vec3 (0.01,-0.02,0),
    "RightShoulder":new vec3 (0,0.05,0),
    "RightArm":new vec3 (0,0.02,0),
    "LeftLeg":new vec3 (0,0.0,-0.09),
    "RightLeg":new vec3 (0,0.0,0.09),
}
// Validate inputs
if (!script.bitmoji) {
    print("Error: Bitmoji is not assigned.");
    return;
}

if (!script.objectToAttach) {
    print("Error: Object Type to attach is not assigned.");
    return;
}

if (script.objectToAttach == "sceneObject") {
    if(!script.object) {
        print("Error: Object to attach is not assigned.");
        return;
    }  
  
}  else if  (script.objectToAttach == "objectPrefab") {
    if(!script.prefab) {
        print("Error: Prefab to attach is not assigned.");
        return;
    }  
}

if (script.hasAnimation && !script.animationPlayer) {
    print("Error: animationPlayer is not assigned.");
        return;
}


// Get the selected joint key
let selectedJointKey;

if (script.bitmoji.mixamoAnimation){
    selectedJointKey = script.jointName;
} else {
    selectedJointKey = Object.keys(bitmojiJointMap).find(key => bitmojiJointMap[key] === script.jointName);
}

// Import helper functions for scene object manipulation
const sceneObjectHelper = require("./SceneObjectHelpersModule");
const bitmojiScript = script.bitmoji;
const bitmojiObject = bitmojiScript.getSceneObject();

/**
 * Attaches the specified object to the selected joint in the Bitmoji rig.
 */
function attachObjectToJoint() {

    bitmojiScript.onDownloaded.add((bitmojiSceneObject) => {
        
        // Find the joint in the Bitmoji rig based on the selected joint key
        const parentJoint = sceneObjectHelper.findChildObjectWithName(bitmojiSceneObject, selectedJointKey);

        if (!parentJoint) {
            print("Error: Could not find the joint to attach the object.");
            return;
        }
        
        if (script.objectToAttach == "sceneObject"){
            // Get the layer of the Bitmoji object
            const bitmojiLayer = bitmojiObject.layer;
        
            // Attach the object to the found joint
            script.object.setParent(parentJoint);
        
            // Set the layer of the attached object to match the Bitmoji's layer
            script.object.layer = bitmojiLayer;
        } else {
            var instanceObject = script.prefab.instantiate(null);
            //Set an anchor for the parent     
            if (instanceObject.getChildrenCount() == 0 ) {
               var anchorObject = global.scene.createSceneObject("Anchor");
               anchorObject.getTransform().setLocalPosition(vec3.zero())
               instanceObject.setParent(anchorObject)
               instanceObject = anchorObject;
            }
            
            instanceObject.setParent(parentJoint);
            var transform = instanceObject.getTransform()
            
            transform.setLocalPosition(defaultOffsetsMap[script.jointName].add(script.positionOffset))

            transform.setWorldScale((new vec3(1,1,1).scale(script.objectScale)))
            var eulerRadians = defaultRotOffsetsMap[script.jointName].add(script.rotationOffset).uniformScale(MathUtils.DegToRad)
        
            var childTransform = instanceObject.getChild(0).getTransform()
            childTransform.setLocalRotation(quat.fromEulerAngles(eulerRadians.x,eulerRadians.y, eulerRadians.z))
            if (script.hasAnimation && script.playAnimationOnLoad) {
                script.animationPlayer.playAll()
            }
        }
    });
}

script.createEvent("OnStartEvent").bind(attachObjectToJoint);

