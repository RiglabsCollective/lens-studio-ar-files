// -----------------------------------------
// StateMachine.js
// -----------------------------------------
// Version: 1.0
// Event: Initialized



// Example:

// var stateMachine = new StateMachine( "Machine" );

// stateMachine.addState(
//     {
//         name: "Idle",            // The name of this state
//         onEnter: idleEnter,        // Callback on state enter
//         onUpdate: idleUpdate,    // Callback on state update
//         onExit: idleExit,        // Callback on state exit
//         transitions: [          // Configs for transitions to other states
//             {
//                 nextStateName: "active", // State name to transition to
//                 checkOnUpdate: checkTransitionToActive, // Function called each frame that returns whether the transition should occur
//                 checkOnSignal: checkIdleSignal, // Function called when the machine receives a signal that returns whether the transition should occur
//             },
//         ],
//         onSignal: { // Dictionary of signal responses
//            "screenTapped": onIdleScreenTapped, // Function to call when this signal is received
//         }
//     }
// );

// stateMachine.enterState( "Idle" );

const { EventWrapper, KeyedEventWrapper } = require("./EventModule");

class StateTransition {
    constructor(currentStateName, nextStateName) {
        // this.state = state;
        this.currentStateName = currentStateName

        this.nextStateName = nextStateName

        this.checkOnUpdate;
        this.checkOnSignal;

        this.onEnter = new EventWrapper()
        this.onUpdate = new EventWrapper()
        this.onExit = new EventWrapper()

        this.duration = 0
        this.currentTime = 0
    }

    enter() {
        this.currentTime = 0
        this.onEnter.trigger(this);
    }

    update(dt) {
        this.currentTime += dt
        if (this.currentTime >= this.duration) {
            this.exit();
        }
        let t = this.duration != 0 ? this.currentTime / this.duration : 1;
        this.normalizedTime = Math.max(Math.min(t, 1), 0);
        this.onUpdate.trigger(this.normalizedTime);
    }

    exit() {
        this.onExit.trigger(this);
    }

    toString() {
        return `From ${this.currentStateName} to ${this.nextStateName} if ${this.checkOnUpdate}`
    }
}

class State {
    constructor(name) {
        this.name = (name == null || name === "") ? "NewState" : name.toString();
        this.onEnter = new EventWrapper()
        this.onExit = new EventWrapper()
        this.onUpdate = new EventWrapper()
        this.onLateUpdate = new EventWrapper()
        this.onSignal = new KeyedEventWrapper()
        // this.data = config.data || {};
        this.printDebug = false;

        this._stateTime = 0;
        this._stateElapsedTime = 0;
        this.canExit = false;

        this.transitions = [];
        this.stateMachine;
    }

    get stateTime() {
        return this._stateElapsedTime;
    }
    get stateCount() {
        return Object.keys(this.states).length;
    }

    addTransitionConfig(config) {
        var transitionObj = new StateTransition(this.name, config.nextStateName);

        if (config.checkOnUpdate) {
            transitionObj.checkOnUpdate = config.checkOnUpdate;
        }
        if (config.checkOnSignal) {
            transitionObj.checkOnSignal = config.checkOnSignal;
        }
        if (config.duration) {
            transitionObj.duration = config.duration;
        }
        transitionObj.onExit.add(() => {
            this.stateMachine.enterState(config.nextStateName);
        })

        this.transitions.push(transitionObj)

        return transitionObj;
    }

    // Transition helpers
    addUpdateTransition(nextStateName, updateCheck, config) {

        config.nextStateName = nextStateName;
        config.checkOnUpdate = updateCheck;

        return this.addTransitionConfig(config);
    }

    addTimedTransition(nextStateName, timeDelay, config) {
        config = config || {};
        return this.addUpdateTransition(nextStateName, function () {
            return this.state._stateElapsedTime >= timeDelay;
        }, config);
    }

    addSignalTransition(nextStateName, signalCheck, config) {
        config = config || {};
        config.nextStateName = nextStateName;
        config.checkOnSignal = signalCheck;
        return this.addTransitionConfig(config);
    }

    addSimpleSignalTransition(nextStateName, signalString, config) {
        config = config || {};
        this.addSignalTransition(nextStateName, function (s) {
            return s === signalString;
        }, config);
    }

    removeTransition(transition) {
        let index = this.transitions.indexOf(transition);
        if (index >= 0) {
            this.transitions.splice(index, 1);
        }
    }
}

/**
 * 
 */
class StateMachine {
    /**
     * 
     * @param {string} name 
     * @param {ScriptComponent} scriptComponent 
     */
    constructor(name, scriptComponent) {
        this.name = (name == null || name === "") ? "NewStateMachine" : name.toString();
        this.currentState = null;
        this.states = {};
        this.onUpdate = new EventWrapper();
        this.onLateUpdate = new EventWrapper();

        this.isTransitioning = false; // internal state to define are we in between states
        this.currentTransition = null;

        scriptComponent.createEvent("UpdateEvent").bind(this.update.bind(this));
        scriptComponent.createEvent("LateUpdateEvent").bind(this.lateUpdate.bind(this));
    };

    addState(newState) {
        if (this.states[newState.name] != undefined) {
            print(`State [ ${newState.name} ] already exists, please select unique name`);
            return;
        }
        this.states[newState.name] = newState;
        newState.stateMachine = this;
    };

    enterState(stateName) {
        if (this.states[stateName] == null) {
            print("[STATE]: Invalid state name: " + stateName);
            return;
        }

        var oldStateName = (this.currentState ? this.currentState.name : null);
        if (oldStateName == stateName) {
            return;
        }
        if (this.currentState != null) {
            this.exitState();
        }
        this.isTransitioning = false;

        this.currentState = this.states[stateName];

        if (this.printDebug) {
            print("[STATE]: Entering State: " + this.currentState.name);
        }

        this.currentState._stateTime = 0;
        this.currentState._stateStartTime = getTime();

        this.currentState.onEnter.trigger(this.currentState);

    };

    exitState() {
        if (this.currentState == null) {
            return;
        }
        this.currentState.onExit.trigger(this.currentState);
        this.currentState = null;

    };

    startTransition(transition) {

        this.isTransitioning = true;
        this.currentTransition = transition;

        transition.enter();
    }

    update(eventData) {
        if (this.isTransitioning && this.currentTransition != null) {
            this.currentTransition.update(eventData.getDeltaTime())
            return;
        }

        if (this.currentState == null) {
            return;
        }

        this.currentState._stateElapsedTime = getTime() - this.currentState._stateStartTime;

        var updateTransitions = this.currentState.transitions;

        if (updateTransitions) {
            for (var t = 0; t < updateTransitions.length; t++) {
                if (updateTransitions[t].checkOnUpdate != undefined && updateTransitions[t].checkOnUpdate(this.currentState)) {
                    this.startTransition(updateTransitions[t]);
                    return;
                }
            }
        }

        this.currentState.onUpdate.trigger(this.currentState);
        this.onUpdate.trigger(this.currentState);
    };

    lateUpdate() {
        if (this.currentState == null) {
            return;
        }

        this.currentState._stateElapsedTime = getTime() - this.currentState._stateStartTime;

        this.currentState.onLateUpdate.trigger(this.currentState);
        this.onLateUpdate.trigger(this.currentState);
    }
}

module.exports = {
    StateMachine,
    State,
    StateTransition
}