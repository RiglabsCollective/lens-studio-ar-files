// Bitmoji 3D.js
// Event: On Awake
// Description: Bitmoji component allows you to download Bitmoji 3D avatar for specified user

// API usage

// add event callbacks: 
// script.onDownloaded.add(() => { ... })) - add calback for succesfull Bitmoji 3D download 

// script.onDownloadFailed.add((e) => {...})) - add calback for succesfull Bitmoji 3D download 

// script.download - call to download avatar for user specified in component inputs

// script.downloadAvatar() - download avatar for a user specified in component inputs

// script.downloadAvatarForUser(snapchatUser) - download avatar for specific user

// script.getUser = () => { return user } - get current user

//@input int bitmojiType = 0 {"widget":"combobox", "values":[{"label":"None", "value": -1}, {"label":"Me", "value":0}, {"label":"My Friend", "value":1}, {"label":"My AI", "value":2} ], "label" : "Bitmoji Owner"}


//@input Component friendsComponent {"showIf" : "bitmojiType" , "showIfValue" : "1", "hint" : "Optional: \nInstall Friends Custom Component from Asset Library\nAdd it to Scene \nReference added component here"}
//@input int friendIndex = 0 {"label":"index" , "showIf" : "bitmojiType" , "showIfValue" : "1"}
//@ui {"widget":"separator"}

//@input string mode = "default" {"widget":"combobox", "values":[{"label":"Default", "value":"default"}, {"label":"Body Tracking", "value":"bodyTracking"}]}
//@input int bodyIndex = 0 {"showIf" : "mode" , "showIfValue" : "bodyTracking"}
//@input bool alignToBody {"showIf" : "mode" , "showIfValue" : "bodyTracking"}
//@input float characterSize = 1.3 {"label" : "Size Multiplier", "showIf" : "mode" , "showIfValue" : "bodyTracking"}
//@input bool mixamoAnimation {"label" : "Adapt to Mixamo","showIf" : "mode" , "showIfValue" : "default", "hint" : "Set Animation Player component to play bitmoji animations "}

//@ui {"widget":"separator"}
//@input bool autoDownload = true {"hint": "download using Bitmoji.download() api instead"}
//@input bool castShadow = true {"hint": "add shadow plane and enable shadows on the light source"}
// hidden inputs
//@input Asset.ObjectPrefab bodyTrackingPrefab
//@input Asset.RemoteMediaModule remoteMediaModule
//@input Asset.BitmojiModule bitmojiModule
//@input Asset.Material materialHolder


let thisObject = script.getSceneObject();
let avatar = null;
let bodyTrackingObject = null;
let bitmojiJoints;
let bitmojiGltfAsset;

let user = undefined;

// avatar v2 map
const JOINTS_LIST = [
    "Hips",
    "Spine",
    "Spine1",
    "Spine2",
    "Neck",
    "Head",

    "LeftShoulder",
    "LeftArm",
    "LeftForeArm",
    "LeftHand",

    "RightShoulder",
    "RightArm",
    "RightForeArm",
    "RightHand",

    "LeftUpLeg",
    "LeftLeg",
    "LeftFoot",
    "LeftToeBase",

    "RightUpLeg",
    "RightLeg",
    "RightFoot",
    "RightToeBase",

    "LeftHandThumb1",
    "LeftHandThumb2",
    "LeftHandThumb3",

    "LeftHandIndex1",
    "LeftHandIndex2",
    "LeftHandIndex3",

    "LeftHandMiddle1",
    "LeftHandMiddle2",
    "LeftHandMiddle3",

    "LeftHandRing1",
    "LeftHandRing2",
    "LeftHandRing3",

    "LeftHandPinky1",
    "LeftHandPinky2",
    "LeftHandPinky3",

    "RightHandThumb1",
    "RightHandThumb2",
    "RightHandThumb3",

    "RightHandIndex1",
    "RightHandIndex2",
    "RightHandIndex3",

    "RightHandMiddle1",
    "RightHandMiddle2",
    "RightHandMiddle3",

    "RightHandRing1",
    "RightHandRing2",
    "RightHandRing3",

    "RightHandPinky1",
    "RightHandPinky2",
    "RightHandPinky3",
]

const mixamoBitmojiMap = {
    'ROOT': 'Hips',
    'C_spine0001_bind_JNT': 'Spine',
    'C_spine0003_bind_JNT': 'Spine1',
    'C_neck0001_bind_JNT': 'Neck',
    'C_head_bind_JNT': 'Head',
    'R_clavicle_bind_JNT': 'RightShoulder',
    'R_armUpper0001_bind_JNT': 'RightArm',
    'R_armLower0001_bind_JNT': 'RightForeArm',
    'R_hand0001_bind_JNT': 'RightHand',
    'L_clavicle_bind_JNT': 'LeftShoulder',
    'L_armUpper0001_bind_JNT': 'LeftArm',
    'L_armLower0001_bind_JNT': 'LeftForeArm',
    'L_hand0001_bind_JNT': 'LeftHand',
    'L_legUpper0001_bind_JNT': 'LeftUpLeg',
    'L_legLower0001_bind_JNT': 'LeftLeg',
    'L_foot0001_bind_JNT': 'LeftFoot',
    'L_foot0002_bind_JNT': 'LeftToeBase',
    'R_legUpper0001_bind_JNT': 'RightUpLeg',
    'R_legLower0001_bind_JNT': 'RightLeg',
    'R_foot0001_bind_JNT': 'RightFoot',
    'R_foot0002_bind_JNT': 'RightToeBase',
}

// import modules
var DestructionHelper = require("Modules/DestructionHelper");
var manager = new DestructionHelper(script);

var eventModule = require("Modules/EventModule");
script.onDownloaded = new eventModule.EventWrapper();
script.onDownloadFailed = new eventModule.EventWrapper();

const BitmojiOwnerType = {
    NONE: -1,
    ME: 0,
    FRIENDBYINDEX: 1,
    AI: 2
}

/**
 * Initializes the script and starts the download process if autoDownload is enabled.
 */
function init() {
    if (script.autoDownload && script.bitmojiType != BitmojiOwnerType.NONE) {
        downloadAvatar();
    }
    script.createEvent("OnDestroyEvent").bind(onDestroy)
}
/**
 * get Bitmoji data based in input settings and downloads gltf asset
 */
async function downloadAvatar() {
    getSnapchatUser()
        .then(user => {
            downloadAvatarForUser(user)
        })
        .catch((e) => {
            print("Download failed, encountered error : " + e);
            script.onDownloadFailed.trigger(e)
        })
}

/**
 * downloads avatar for specific user
 * @param {SnapchatUser} user 
 */
async function downloadAvatarForUser(snapchatUser) {
    if (avatar) {
        print("Warning, this coponent have already downloaded avatar, destroying instantiated avatar")
        onDestroy();
    }
    user = snapchatUser;
    var options = Bitmoji3DOptions.create();
    options.user = user;

    print("Downloading Bitmoji 3D avatar of " + user.displayName + " ...");

    try {
        const bitmoji3DResource = await getBitmojiResource(options);

        const gltfAsset = await download3DAsset(bitmoji3DResource);

        print("Downloaded Bitmoji 3D avatar of " + user.displayName + "!");

        onDownloaded(gltfAsset);
    } catch (e) {
        print("Error:" + e);
        script.onDownloadFailed.trigger(e);
    }
}

/**
 * Determines the user based on the selected Bitmoji type.
 * @returns {Promise<SnapchatUser>} Resolves with the user data.
 */
async function getSnapchatUser() {
    return new Promise(function (resolve, reject) {
        switch (script.bitmojiType) {
            case 0:
                global.userContextSystem.getCurrentUser(function (user) {
                    resolve(user);
                });
                break;
            case 1:
                //get list of friends from the Friends component
                if (script.friendsComponent != undefined && script.friendsComponent.friends != undefined) {
                    script.friendsComponent.friends().then((users) => {
                        let friend = friendWithIndexExists(users, script.friendIndex);
                        if (friend != null) {
                            resolve(friend);
                        } else {
                            reject("Friend with index " + script.friendIndex + " doesn't exist for this user");
                        }
                    }).catch(
                        (e) => {
                            print(e);
                            reject();
                        }
                    )
                } else {
                    global.userContextSystem.getAllFriends(function (users) {
                        let friend = friendWithIndexExists(users, script.friendIndex);
                        if (friend != null) {
                            resolve(friend);
                        } else {
                            reject();
                        }
                    });
                }
                break;
            case 2:
                global.userContextSystem.getMyAIUser(function (user) {
                    resolve(user);
                })
                break;
        }
    })
}

/**
 * check if user exists
 * @param {SnapchatUser[]} friends 
 * @param {number} index 
 * @returns {SnapchatUser | null}
 */
function friendWithIndexExists(friends, index) {
    let usersWithBitmoji = friends.filter(user => user.hasBitmoji);
    if (usersWithBitmoji.length > script.friendIndex && usersWithBitmoji.length >= 0) {
        return friends[index];
    } else {
        return null;
    }
}

/**
 * get Bitmoji 3D resource
 * @param {Bitmoji3DOptions} options 
 * @returns {Promise<Bitmoji3DResource>}
 */
function getBitmojiResource(options) {
    return new Promise(function (resolve, reject) {
        script.bitmojiModule.requestBitmoji3DResourceWithOptions(options, resolve);
    })
}

/**
 * download Bitmoji 3D assets
 * @param {Bitmoji3DResource} bitmoji3DResource 
 * @returns {Promise<ObjectPrefab>}
 */
function download3DAsset(bitmoji3DResource) {
    return new Promise(function (resolve, reject) {
        script.remoteMediaModule.loadResourceAsGltfAsset(
            bitmoji3DResource,
            resolve,
            reject
        )
    })
}

/**
 * configure scene once gltf asset is downloaded
 * @param {ObjectPrefab} gltfAsset 
 */
function onDownloaded(gltfAsset) {

    //instantiate bitmoji avatar
    let settings = GltfSettings.create()
    settings.convertMetersToCentimeters = true
    avatar = gltfAsset.tryInstantiateWithSetting(thisObject, script.materialHolder, settings)
    bitmojiJoints = buildJointMap({}, avatar);

    bitmojiGltfAsset = gltfAsset;

    let layer = thisObject.layer;
    applyFunctionRecursively(avatar, (so) => {
        so.layer = layer
        configureShadows(so);
    })

    switch (script.mode) {
        case "bodyTracking":
            setUpBodyTracking();
            break;
        case "default":
            if (script.mixamoAnimation) {
                remap();
                addScaleCompensation();
            }
            avatar.setParent(thisObject);
            break;
    }
    script.onDownloaded.trigger(avatar);
}
/**
 * set up with body tracking component
 */
function setUpBodyTracking() {
    if (script.alignToBody) {
        thisObject.getTransform().setLocalPosition(vec3.zero())
    }

    bodyTrackingObject = script.bodyTrackingPrefab.instantiate(thisObject);

    let bodyTracking3D = bodyTrackingObject.getComponent("Component.ObjectTracking3D");
    bodyTracking3D.objectIndex = script.bodyIndex;
    bodyTracking3D.trackingAsset.handTrackingEnabled = true;

    avatar.enabled = false
    avatar.setParent(bodyTrackingObject)

    for (let jointName of JOINTS_LIST) {
        let attached = bodyTracking3D.getAttachedObjects(jointName)
        if (attached.length == 1) {
            let tPoseJoint = attached[0]
            let bitmojiJoint = bitmojiJoints[tPoseJoint.name]
            if (bitmojiJoint) {
                let tPoseRotation = tPoseJoint.getTransform().getLocalRotation()
                bitmojiJoint.getTransform().setLocalRotation(tPoseRotation)
                bodyTracking3D.removeAttachmentPoint(tPoseJoint)
                bodyTracking3D.addAttachmentPoint(jointName, bitmojiJoint)
            }
        }
    }

    //add callback
    bodyTracking3D.onTrackingStarted = manager.safeCallback(onBodyTrackjingStarted);
    bodyTracking3D.onTrackingLost = manager.safeCallback(onBodyTrackingLost);

    if (script.alignToBody) {
        bodyTrackingObject.getTransform().setLocalScale(vec3.one().uniformScale(script.characterSize));
    }
}
/**
 * Rename joints names to mixamo joint names
 */
function remap() {
    for (let joint in bitmojiJoints) {
        if (mixamoBitmojiMap[joint]) {
            bitmojiJoints[joint].name = mixamoBitmojiMap[joint];
        }
    }
}

/**
 * Update Root/Hips Local Scale on the first frame
 */
function addScaleCompensation() {
    let bmRoot = bitmojiJoints["ROOT"];
    // create new scen eobject
    let so = global.scene.createSceneObject("Hips_SSC_Mixamo");
    so.setParent(bmRoot.getParent())
    //scale object down and scale hip up a 100
    so.getTransform().setLocalScale(vec3.one().uniformScale(0.01))
    let scale = bmRoot.getTransform().getLocalScale();
    bmRoot.getTransform().setLocalScale(scale.uniformScale(100));
    // set a parent - now hip position keys should be correct
    bmRoot.setParent(so);
}

/**
 * creates a map of child names -> child scene object
 * @param {object} m 
 * @param {SceneObject} root 
 * @returns 
 */
function buildJointMap(m, root) {
    for (let i = 0; i < root.getChildrenCount(); i++) {
        let child = root.getChild(i);

        m[child.name] = child;
        buildJointMap(m, child)
    }
    return m;
}
/**
 * 
 * @param {SceneObject} so 
 */
function configureShadows(so) {
    let rmv = so.getComponent("RenderMeshVisual");
    if (rmv != null) {
        rmv.meshShadowMode = script.castShadow ? MeshShadowMode.Caster : MeshShadowMode.None
    }
}
/**
 * 
 * @param {SceneObject} sceneObject 
 * @param {function<SceneObject>} func 
 */
function applyFunctionRecursively(sceneObject, func) {
    for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
        let child = sceneObject.getChild(i);
        func(child);
        applyFunctionRecursively(child, func);
    }
}

/**
 * enable avatar on body found
 */
function onBodyTrackjingStarted() {
    avatar.enabled = true;
}
/**
 * disable avatar on body lost
 */
function onBodyTrackingLost() {
    avatar.enabled = false;
}

/**
 * clean up scene objects created in runtime
 */
function onDestroy() {
    if (!isNull(avatar)) {
        avatar.destroy()
    }
    if (!isNull(bodyTrackingObject)) {
        bodyTrackingObject.destroy()
    }
}

script.download = downloadAvatar; // prevoius api for compatibility

script.downloadAvatar = downloadAvatar;

script.downloadAvatarForUser = downloadAvatarForUser;

script.getUser = () => { return user }

script.getExtras = () => { return bitmojiGltfAsset.extras }

script.createEvent("OnStartEvent").bind(init);