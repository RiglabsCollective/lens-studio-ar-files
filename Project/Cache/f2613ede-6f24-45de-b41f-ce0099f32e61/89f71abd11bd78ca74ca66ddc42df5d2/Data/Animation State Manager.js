// AnimationStateManager.js
// Version 1.0.3 for Lens Studio 5.0.15 + 
// Description: Script for managing animation states and transitions in a component-based animation system.
// It allows the creation of animation states from single clips or blend trees, defines parameters for controlling 
// animations, and sets up transitions between states based on conditions. The script includes functionality for 
// debugging and visualizing the state machine and its parameters.


// api examples :
// You can add a parameter to control animations by calling the addParameter method with the parameter name and default value.

// script.addParameter("speed", 1.0);

// To set the value of a parameter, use the setParameter method with the parameter name and the new value.
// script.setParameter("speed", 1.5);

// Set a trigger by calling setTrigger with the trigger name.
// script.setTrigger("jump");

// Reset a trigger by calling resetTrigger with the trigger name.
// script.resetTrigger("jump");

// Get a state to add callbacks or query its status using getState.

// let runState = script.getState("Run");
// runState.onEnter.add(function() {
//     print("Entered Run state");
// });

// Force a state change immediately or with a transition duration by calling setState.

// script.setState("Idle", 0); // Immediately change to Idle state
// script.setState("Run", 0.5); // Transition to Run state over 0.5 seconds


// Define a new state from a configuration object using addStateFromConfig.

// let state = {
//     stateName: "Run",
//     source: 0, // From Single Clip
//     clipName: "RunAnimationClip"
// };
// script.addStateFromConfig(state);

// Define a transition from a configuration object using addTransitionFromConfig.
// let transition = {
//     enabled: true,
//     fromStateType: 0, // Specific state
//     fromStateName: "Idle",
//     toStateType: 0, // Specific state
//     toStateName: "Run",
//     duration: 0.5,
//     hasExitTime: false,
//     conditions: [
//         {
//             paramName: "speed",
//             type: "Float",
//             funcFloat: "IsGreater",
//             valueFloat: 0.5
//         }
//     ]
// };
// script.addTransitionFromConfig(transition);

// Define custom types

/* Represents a pair of clip and threshold
@typedef ClipWeightPair
@property {string} clipName 
@property {float} threshold
*/
//@input ClipWeightPair tempClip {"showIf" : "advanced"} //
//@input bool advanced {"showIf" : "advanced"}

/* - Represents animation state
@typedef AnimationState
@property {string} stateName {"label" : "Name"}
@property {int} source {"widget" : "Combobox", "values" : [{"label" : "From Single Clip", "value" : 0}, {"label" : "From Blend Tree", "value" : 1}]}

@property {string} clipName {"label" : "Animation Clip", "showIf" : "source", "showIfValue" : "0"}
@property {ClipWeightPair[]} blendTreeClips { "showIf" : "source", "showIfValue" : "1"}
@property {bool} normalizeClipDuration { "showIf" : "source", "showIfValue" : "1"}
@property {string} blendParameterName { "label" : "Blend Parameter" , "showIf" : "source", "showIfValue" : "1"}
*/

/*
@typedef AnimationParameter
@property {string} paramName {"label" : "Name"}
@property {string} type = "Trigger" {"widget" : "Combobox", "values" : [{"label" : "Float", "value" : "Float"}, {"label" : "Int", "value" : "Int"}, {"label" : "Bool", "value" : "Bool"}, {"label" : "Trigger", "value" : "Trigger"}]}
@property {int} valueInt {"showIf" : "type" , "showIfValue" : "Int",  "label" : "Value"}
@property {float} valueFloat {"showIf" : "type" , "showIfValue" : "Float",  "label" : "Value"}
@property {bool} valueBool  {"showIf" : "type" , "showIfValue" : "Bool",  "label" : "Value"}
@property {bool} valueTrigger  {"showIf" : "type" , "showIfValue" : "Trigger",  "label" : "On"}
*/

/*
@typedef AnimationParameterCondition
@property {string} paramName {"label" : "Name"}
@property {string} type = "Trigger" {"widget" : "Combobox", "values" : [{"label" : "Float", "value" : "Float"}, {"label" : "Int", "value" : "Int"}, {"label" : "Bool", "value" : "Bool"}, {"label" : "Trigger", "value" : "Trigger"}]}
@property {string} funcInt  = "Equal" {"showIf" : "type" , "showIfValue" : "Int",  "label" : "Function", "widget" : "Combobox", "values" : [{"label" : "Equal", "value" : "Equal"}, {"label" : "Not Equal", "value" : "NotEqual"}, {"label" : "Is Less", "value" : "IsLess"}, {"label" : "Is Greater", "value" : "IsGreater"}]}
@property {string} funcFloat = "IsLess" {"showIf" : "type" , "showIfValue" : "Float",  "label" : "Function", "widget" : "Combobox", "values" : [ {"label" : "Is Less", "value" : "IsLess"}, {"label" : "Is Greater", "value" : "IsGreater"}]}
@property {string} funcBool = "IsLess" {"showIf" : "type" , "showIfValue" : "Bool",  "label" : "Function", "widget" : "Combobox", "values" : [ {"label" : "Is True", "value" : "IsTrue"}, {"label" : "Is False", "value" : "IsFalse"}]}
@property {int} valueInt {"showIf" : "type" , "showIfValue" : "Int",  "label" : "Value"}
@property {float} valueFloat {"showIf" : "type" , "showIfValue" : "Float",  "label" : "Value"}
*/

//@input AnimationParameterCondition tempInput {"showIf" : "advanced"}
//@input bool advanced {"showIf" : "advanced"}
/*
@typedef StateTransition

@property {bool} enabled = true
@property {int} fromStateType = 0 {"label" : "From","widget" : "combobox", "values" : [{"label" : "Entry", "value" : -1}, {"label" : "Any", "value" : 1}, {"label" : "Spefic State", "value" : 0}]}
@property {string} fromStateName {"label" : "   Name", "showIf" : "fromStateType" , "showIfValue" : 0}
@property {int} toStateType = 0 {"label" : "To","widget" : "combobox", "values" : [ {"label" : "Specific State", "value" : 0}, {"label" : "Exit", "value" : 2}]}
@property {string} toStateName {"label" : "   Name", "showIf" : "toStateType" , "showIfValue" : 0}
@property {float} duration {"label" : "   Duration"}
@property {bool} hasExitTime {"label" : "   Has Exit Time"}
@property {float} exitTime = 1.0 {"label" : "      Exit Time" , "showIf" : "hasExitTime", "hint" : "Normalized time of From state when transition should start"}
@ui {"widget" : "separator"}
@property {AnimationParameterCondition[]} conditions */

// Script Inputs 

//@input Component.AnimationPlayer animationPlayer
//@ui {"widget":"separator"}
/** @type {AnimationPlayer} */
let player = script.animationPlayer;

//@ui {"widget":"label", "label":"<b>Animation States</b>"}
//@input bool editAnimationStates = false {"label" : "Edit", "hint" : "Create animation states from one or several animation clips "}
//@input bool createStatesFromClips {"label" : "    Create From Clips", "showIf" : "editAnimationStates", "hint" : "Automatically create states that match clip names and settings"}
//@ui {"widget":"group_start","label":"Custom States", "showIf" : "editAnimationStates",  "hint" : "Create specific states by specifying names and clips"}
//@input AnimationState[] states { "showIf" : "editAnimationStates",  "hint" : "Create specific states by specifying names and clips"}
//@ui {"widget":"group_end","label":""}

//@ui {"widget":"separator"}

//@ui {"widget":"label", "label" : "<b>Parameters<\b>"}
//@input bool editParameters = false {"label" : "Edit", "hint": "Define parameters that can be used for triggering transitions or as a weight of a blend tree"}
//@ui {"widget":"group_start","label":"Parameters", "showIf": "editParameters"}
//@input AnimationParameter[] parameters 
//@ui {"widget":"group_end","label":""}

//@ui {"widget":"separator"}
//@ui {"widget":"label","label":"<b>Transitions</b>"}
//@input bool editTransitions = false {"label" : "Edit", "hint": "Specify transitions between states and conditions that have to suffice"}
//@ui {"widget":"group_start","label":"Transitions", "showIf": "editTransitions"}
//@input StateTransition[] transitions
//@ui {"widget":"group_end","label":""}
//@ui {"widget":"separator"}
//@input bool showDebug = true
//@input Component.Text debugText {"showIf" : "showDebug"}
//@input bool displayParameters  {"showIf" : "showDebug"}
//@input bool displayStates  {"showIf" : "showDebug"}

// Enums 
const StateType = {
    Entry: -1,
    Specific: 0,
    Any: 1,
    Exit: 2
};

const StateSource = {
    SingleClip: 0,
    BlendTree: 1
};

const ConditionFunction = {
    Equal: (a, b) => {
        return a.value == b;
    },
    NotEqual: (a, b) => {
        return a.value != b;
    },
    IsLess: (a, b) => {
        return a.value < b;
    },
    IsGreater: (a, b) => {
        return a.value > b;
    },
    IsTrue: (a) => {
        return a.value === true;
    },
    IsFalse: (a) => {
        return a.value === false;
    }
};

const ParameterType = {
    Trigger: "Trigger",
    Int: "Int",
    Float: "Float",
    Bool: "Bool"
}

class AnimationParameter {
    constructor(type, value) {
        this.type = type;              // Type of the animation parameter
        this.value = value;            // Value of the animation parameter
        this.shouldConsume = false; // Flag indicating if the trigger should be consumed
    }
}
// Dependencies

const { BlendTree1D, putClipAtEndIfNeeded } = require("Modules/AnimationHelpers.js");
const { StateMachine, State, StateTransition } = require("Modules/StateMachine.js");


// Variables


let parameters;
var stateMachine = new StateMachine("Animation", script);
//store some info and allow access per name
let stateInfoDict = {};

function init() {

    if (!player) {
        print("WARNING, please set [Animation Player] input");
        return;
    }

    player.stopAll();

    let clipNames = player.clips.map((clip) => {
        return clip.name;
    });  // get all clips and assume this array doesn't change, temporary workaround

    if (script.createStatesFromClips) {
        clipNames.forEach(cn => {
            /** @type {AnimationState} */
            let s = {
                type: StateType.Specific,
                stateName: cn,
                source: StateSource.SingleClip,
                clipName: cn
            };
            let state = initializeAnimationState(s);
            if (state) {
                //print(`INFO, [${cn}] Animation State was created from clip`)
            }
        });
    }
    //initialize animation states 
    script.states.forEach(s => {
        s.type = StateType.Specific;
        initializeAnimationState(s);
    });

    initializeAnimationState({ type: StateType.Entry });
    initializeAnimationState({ type: StateType.Exit });

    /** */
    parameters = {};

    if (script.parameters) {
        script.parameters.forEach(p => {
            parameters[p.paramName] = new AnimationParameter(p.type, p["value" + p.type]);
        });
    }
    script.transitions.forEach(t => addTransition(t));

    stateMachine.enterState("EntryState");

    if (script.showDebug && script.debugText) {
        script.createEvent("LateUpdateEvent").bind(showDebug);
    }

    script.createEvent("LateUpdateEvent").bind(resetTriggerState);
}
/**
 * 
 * @param {StateTransition} t 
 */
function addTransition(t) {
    if (!t.enabled) {
        return;
    }
    switch (t.fromStateType) {
        case StateType.Entry: // from entry state 
            addTransitionBetweenStates("EntryState", t.toStateName, t);
            break;
        case StateType.Any: // from any state
            for (let s in stateMachine.states) {
                if (s != t.toStateName) {
                    addTransitionBetweenStates(s, t.toStateName, t);
                }
            }
            break;
        case StateType.Specific: // from specific state 
            let arr = t.fromStateName.split(', ');
            for (var i = 0; i < arr.length; i++) {
                addTransitionBetweenStates(arr[i], t.toStateName, t);
            }
            break;
    }
}

/**
 * add state transtion that checks on update if certain condition is met 
 * and switches to a next state 
 * @param {string} fromStateName 
 * @param {string} toStateName 
 * @param {object {}} config 
 * @returns {StateTransition}
 */
function addTransitionBetweenStates(fromStateName, toStateName, config) {
    if (!config.enabled) {
        return;
    }
    if (stateInfoDict[fromStateName] == undefined) {
        print(`WARNING, Can not add transition [ ${fromStateName} ]-->[ ${toStateName} ], state [ ${fromStateName} ] is not defined `);
        return null;
    }
    if (stateInfoDict[toStateName] == undefined) {
        print(`WARNING, Can not add transition [ ${fromStateName} ]-->[ ${toStateName} ], state [ ${toStateName} ] is not defined `);
        return null;
    }
    // a combined function that has to return true in order to start transition

    let checkFucntions = getConditionFunctions(config);

    if (config.hasExitTime) {
        if (stateInfoDict[fromStateName].type == StateSource.SingleClip) {
            let clipName = stateInfoDict[fromStateName].clipName;
            checkFucntions.push(() => {
                return checkTimeToExit(clipName, config.exitTime, config.duration);
            });
            // note - this needs to be implemented for other types of states as well
        }
    }
    // if (checkFucntions.length == 0) {
    //     // no conditions given - should we ignore this transition?  or execute immediately?
    // }
    let transition = stateMachine.states[fromStateName].addUpdateTransition(toStateName, combineFunctions(checkFucntions), { duration: config.duration });

    // add transition callbacks
    // on transition enter
    transition.onEnter.add(() => {
        moveToEnd(stateInfoDict[toStateName]);
        stateInfoDict[toStateName].play(); // start playing animations we are transitioning to, weight i
        stateInfoDict[toStateName].setWeight(0);
        consumeTriggers(config.conditions);
    });

    // on transition update
    transition.onUpdate.add((weight) => {
        weight = Math.min(Math.max(0, weight), 1.0);
        stateInfoDict[fromStateName].setWeight(1.0); // set from state to 1 
        stateInfoDict[toStateName].setWeight(weight);
    });
    // stop animation on transition enter 
    transition.onExit.add(() => {
        stateInfoDict[fromStateName].stop();
    });
    return transition;
}
/**
 * moves animation clip to the end of the list to allow proper blending
 * since animations are applied in order they appear in animation player
 * @param {AnimationState} s 
 */
function moveToEnd(s) {
    if (s.type == StateSource.SingleClip) {
        putClipAtEndIfNeeded(player, s.clipName);
    } else if (s.type == StateSource.BlendTree) {
        s.blendTree.moveToEnd();
    }
}

/**
 * generate condition functions 
 * @param {StateTransition} t 
 * @returns {function[]} list of functions that return bool
 */
function getConditionFunctions(t) {
    let checkFucntions = [];
    t.conditions.forEach(
        c => {
            if (!parameters[c.paramName]) {
                checkFucntions.push(() => {
                    return false;
                });
                print(`ERROR, please define parameter [${c.paramName}] in Parameters section of script UI`);
                return;
            }
            let func = ConditionFunction[c["func" + c.type]];
            let value = c["value" + c.type];
            if (c.type == "Trigger") {

                func = function (p) {
                    if (ConditionFunction.IsTrue(p)) {
                        p.shouldConsume = true;
                        return true;
                    }
                    return false;
                };
            }
            checkFucntions.push(() => {
                return func(parameters[c.paramName], value);
            });
        }
    );
    return checkFucntions;
}

/**
 * Combines one or more functions into a single function that returns true only if all provided functions return true.
 *
 * @param {function|function[]} arg - A single function or an array of functions.
 * @returns {function} - Combined function that returns true if all provided functions return true, otherwise false.
 */
function combineFunctions(arg) {
    if (Array.isArray(arg)) {
        return () => {
            for (let i = 0; i < arg.length; i++) {
                if (!arg[i]()) {
                    return false;
                }
            }
            return true;
        };
    } else {
        return arg;
    }
}

/**
 * interface for playing stopping and blending different kinds of animation clips 
 * @param {AnimationState} s 
 * @returns {State} new state machine state
 */
function initializeAnimationState(config) {
    switch (config.type) {
        case StateType.Specific:
            if (config.source == StateSource.SingleClip) {
                // check inputs
                if (!player.getClip(config.clipName)) {
                    print(`WARNING, Clip ${config.clipName} not found on Animation Player, please check the clip name`);
                    return;
                }
                let clipName = config.clipName;
                config.play = () => {
                    let clip = player.getClip(clipName);
                    clip.weight = 1.0;
                    player.playClipAt(clipName, clip.begin);
                };

                config.setWeight = (w) => {
                    player.getClip(clipName).weight = w;
                };

                config.stop = () => {
                    player.stopClip(clipName);
                    player.getClip(clipName).weight = 0;
                };
            } else if (config.source == StateSource.BlendTree) {
                // check inputs
                if (config.blendTreeClips.length < 2) {
                    print("Error, blendtree should have at leaset two clips");
                    return;
                }
                let blendTree = createBlendTree(config.blendTreeClips, config.normalizeClipDuration);
                let getParameter = () => {
                    return parameters[config.blendParameterName].value;
                };

                config.play = () => {
                    blendTree.play();
                };
                config.setWeight = (w) => {
                    blendTree.weight = w;
                };
                config.update = () => {
                    blendTree.parameter = getParameter();
                };
                config.stop = () => {
                    blendTree.stop();
                };
                //so many hacks here 
                config.blendTree = blendTree;
            } else {
                print("Wrong source type");
            }
            break;
        case StateType.Entry:
            config.stateName = "EntryState";
            config.play = () => { };
            config.setWeight = (w) => { };
            config.update = () => { };
            config.stop = () => { };
            break;
        case StateType.Exit:
            config.stateName = "OnExit";
            config.play = () => { };
            config.setWeight = (w) => { };
            config.update = () => { };
            config.stop = () => { };
            break;
    }
    // store config for future reference 
    stateInfoDict[config.stateName] = config;
    // create new state machine state
    let state = new State(config.stateName);
    stateMachine.addState(state);

    if (config.update) {
        state.onUpdate.add(config.update);
    }
    if (config.stop) {
        state.onExit.add(config.stop);
    }
    // no on Enter callback here since we trigger that from transition
    // next state animation starts to play within the transition time
    // and only actually enters state once transition is over
    return state;
}

/**
 * create blend tree from arguments
 * @param {ClipsWeightPair[]} clipThresholdPairs 
 * @param {boolean} normalize 
 */
function createBlendTree(clipThresholdPairs, normalize) {
    let blendTree = new BlendTree1D(player, script);

    blendTree.normalizeClipDuration = normalize;
    for (var i = 0; i < clipThresholdPairs.length; i++) {
        if (clipThresholdPairs[i] && player.getClip(clipThresholdPairs[i].clipName)) {
            blendTree.addChild(clipThresholdPairs[i].clipName, clipThresholdPairs[i].threshold);
        }
    }
    return blendTree;
}


/**
 * check if clip is over
 * @param {string} clipName 
 * @param {number} normalizedTime 
 * @param {number} delta 
 * @returns {bool}
 */
function checkTimeToExit(clipName, normalizedTime, delta) {
    let clip = player.getClip(clipName);
    return (player.getClipCurrentTime(clipName) - clip.begin + delta) / player.getClip(clipName).duration >= normalizedTime;
}

/**
 * 
 * @param {} conditions 
 */
function consumeTriggers(conditions) {
    conditions.forEach(c => {
        let p = parameters[c.paramName];
        if (p !== undefined && p.type == "Trigger" && p.shouldConsume) {
            p.value = false;
        }
    });
}

function resetTriggerState(parameters) {
    Object.keys(parameters).forEach(name => {
        let p = parameters[name];
        if (p.type == "Trigger" && p.shouldConsume) {
            p.shouldConsume = false;
        }
    });
}


/**'
 * optional on screen debug
 */
function showDebug() {
    let s = "";
    if (script.displayStates) {
        s += "Current State: \n";
        if (stateMachine.isTransitioning) {
            s += stateMachine.currentTransition.currentStateName + " -> " + stateMachine.currentTransition.nextStateName;
        } else {
            s += stateMachine.currentState.name;
        }
        s += "\n";
    }
    if (script.displayParameters) {
        s += "Parameters: \n";
        for (let c in parameters) {
            s += `${c} : ${parameters[c].type != "Trigger" ? parameters[c].value : (parameters[c].value ? "x" : "o")} \n`;
        }
    }
    script.debugText.text = s;
}
/**
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function isParameterDefined(name) {
    if (parameters[name] == undefined) {
        print(`WARNING, Parameter [${name}] is not defined, add parameter in script UI`);
        return false;
    }
    return true;
}
// 
// PUBLIC API
//
/**
 * 
 * @param {string} name 
 * @param {boolean|number} defaultValue 
 */
script.addParameter = function (name, defaultValue) {
    parameters[name] = new AnimationParameter(name, defaultValue);
};
/**
 * 
 * @param {string} name 
 * @param {boolean|number} value 
 */
script.setParameter = function (name, value) {
    if (isParameterDefined(name)) {
        parameters[name].value = value;
    }
};
/**
 *
 * @param {string} name 
 */
script.setTrigger = function (name) {

    if (parameters[name] == undefined) {
        print(`WARNING, Trigger [${name}] is not defined`);
    } else {
        parameters[name].value = true;
        parameters[name].shouldConsume = false;
    }
};
/**
 * 
 * @param {string} name 
 */
script.resetTrigger = function (name) {
    if (parameters[name] == undefined) {
        print(`WARNING, Trigger [${name}] is not defined`);
    } else {
        parameters[name].value = false;
        parameters[name].shouldConsume = false;
    }
};
/**
 * 
 * @param {string} name 
 * @returns {State} state machine state, use this to add callbacks
 */
script.getState = function (name) {
    return stateMachine.states[name];
};
/**
 * Force change state
 * @param {string} newState 
 * @param {number} transitionDuration 
 */
script.setState = function (newState, transitionDuration) {
    if (stateMachine.states[newState] == undefined) {
        print(`WARNING, State [${newState}] is not defined`);
        return;
    }
    let currentState = stateMachine.currentState.name;
    if (currentState == newState) {
        return;
    }
    if (transitionDuration == undefined || transitionDuration == 0 || currentState == null) {
        stateMachine.enterState(newState);
        // if there is no transition play immediately
        stateInfoDict[newState].play();
    } else {

        let transition = addTransitionBetweenStates(currentState, newState, {
            enabled: true,
            duration: transitionDuration,
            hasExitTime: false,
            conditions: []
        });
        if (transition == null) {
            return;
        }
        transition.onExit.add(() => {
            stateMachine.states[currentState].removeTransition(transition);// remove on complete to avoid auto triggering
        });
        stateMachine.startTransition(transition);
    }
};
/**
 * 
 * @param {StateTransition} stateTransition 
 */
script.addTransitionFromConfig = function (stateTransition) {
    addTransition(stateTransition);
};
/**
 * 
 * @param {AnimationState} s 
 */
script.addStateFromConfig = function (s) {
    initializeAnimationState(s);
};

script.getCurrentStateName = function () {
    if (stateMachine.currentState != null) {
        return stateMachine.currentState.name;
    }
};

Object.defineProperty(script, "stateMachine", {
    get: () => {
        return stateMachine;
    }
});

script.StateSource = StateSource
script.ConditionFunction = ConditionFunction
script.StateType = StateType
script.ParameterType = ParameterType

init();