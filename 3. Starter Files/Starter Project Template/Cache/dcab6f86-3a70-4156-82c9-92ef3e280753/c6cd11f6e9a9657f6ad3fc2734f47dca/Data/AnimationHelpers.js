// AnimationHelpers.js
// Version: 1.0.0
// Event: On Awake
// Description: This module provides helper functions for managing animation clips and a BlendTree1D class 
//              for blending animations in a one-dimensional space.

// Functions:
// - putClipAtEndIfNeeded(animationPlayer, clipName):
//   Ensures that a specified clip is the last in the order of clips in the given animation player. 
//   If the clip is not found or already at the end, appropriate actions are taken.

// - lerp(a, b, t):
//   Linearly interpolates between values `a` and `b` by parameter `t`.

// - remap(value, inMin, inMax, outMin, outMax):
//   Remaps a value from one range to another.

// Class: BlendTree1D
// - constructor(player, script):
//   Initializes a new instance of the BlendTree1D class with the specified animation player and script.

// - addChild(name, threshold):
//   Adds an animation clip to the blend tree at a specified threshold.

// - playAt(offset):
//   Starts playing the blend tree from a specified offset.

// - stop():
//   Stops all animations in the blend tree.

// - moveToEnd():
//   Ensures all animations are at the end of the player's clip list.

// - parameter (getter and setter):
//   Gets or sets the blend parameter.

// - normalizeClipDuration (getter and setter):
//   Gets or sets whether to normalize the clip durations.

// - toString():
//   Prints the blend tree animations and weights.

/**
 * 
 * @param {AnimationPlayer} animationPlayer 
 * @param {string} clipName 
 * @returns {AnimationClip}
 */
function putClipAtEndIfNeeded(animationPlayer, clipName) {
    const clips = animationPlayer.clips;
    const currentOrderOfClips = clips.map(function (clip) { return clip.name; });
    const clipIndex = currentOrderOfClips.indexOf(clipName);

    if (clipIndex != clips.length - 1) {
        if (clipIndex < 0) {
            print(`Clip ${clipName} is not found in the provided Animation Player.`);
            return;
        }

        const clonedClip = clips[clipIndex].clone(clipName);
        animationPlayer.removeClip(clipName);
        animationPlayer.addClip(clonedClip);
        return clonedClip;
    }
    return animationPlayer.getClip(clipName)
}

/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 * @returns 
 */
function lerp(a, b, t) {
    return a * (1.0 - t) + b * t;
}

/**
* Returns the input value remapped from the input range to the output range
* @param {number} value Value in
* @param {number} inMin Input range minimum
* @param {number} inMax Input range maximum
* @param {number} outMax Output range minimum
* @param {number} outMin Output range maximum
* @returns {number} `value` remapped from the input range to the output range
*/
function remap(value, inMin, inMax, outMin, outMax) {
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

/**
 * a class for blending several animations 
 */
class BlendTree1D {
    /**
    * @param {AnimationPlayer} player - animation player.
    * @param {ScriptComponent} script - script reference
    */
    constructor(player, script) {
        this.player = player;
        this._normalizeClipDuration = false
        this._parameter = 0
        this.minThreshold = 0;
        this.maxThreshold = 1;
        this._animations = [];
        this.updateEvent = script.createEvent("UpdateEvent");
        this.updateEvent.bind(this._blend.bind(this));
        this.weight = 1.0;
    }
    /**
     * 
     * @param {string} name - clip name
     * @param {number} threshold - parameter value [0, 1]
     */
    addChild(name, threshold) {
        if (threshold > this.maxThreshold || threshold < this.minThreshold) {
            print("Error on adding " + name + " animation clip, threshold should be in range [" + this.minThreshold + "," + this.maxThreshold + "]")
        }
        this._animations.push({
            name: name,
            clip: this.player.getClip(name),
            threshold: threshold
        })
        this._animations.sort((a, b) => { return a.threshold - b.threshold })
    }
    /**
     * play clips
     */
    play() {
        this._animations.sort((a, b) => { return a.threshold - b.threshold })

        for (let i = 0; i < this._animations.length; i++) {
            // temporary disabled because of a bug
            this._animations[i].clip = putClipAtEndIfNeeded(this.player, this._animations[i].name)
            this._animations[i].clip = this.player.getClip(this._animations[i].name)
            if (!this.player.getClipIsPlaying(this._animations[i].name)) {
                this.player.playClipAt(this._animations[i].name, this._animations[i].clip.begin)
            }
        }
        this.updateEvent.enabled = true;
        this._blend()
    }
    /**
     * stop all clips
     */
    stop() {
        this._animations.forEach(anim => {
            this.player.stopClip(anim.name)
        })
        this.updateEvent.enabled = false;
    }

    _blend() {
        let len = this._animations.length
        if (len < 1) {
            return;
        }

        // reset all weights
        this._animations.forEach(e => {
            e.clip.weight = 0
            e.clip.playbackSpeed = 1.0
        });
        //print(this.weight)
        if (this.parameter <= this._animations[0].threshold) {
            this._animations[0].clip.weight = 1.0 * this.weight;
        }
        if (this.parameter >= this._animations[len - 1].threshold) {
            this._animations[len - 1].clip.weight = this.weight;
            this._animations[len - 1].clip.playbackSpeed = 1.0
            //print("more than 1")
        }
        for (var i = 0; i < len - 1; i++) {
            if (this._parameter > this._animations[i].threshold &&
                this.parameter <= this._animations[i + 1].threshold) {
                this._blendAnimations(this._animations[i].clip,
                    this._animations[i + 1].clip,
                    remap(this.parameter, this._animations[i].threshold, this._animations[i + 1].threshold, 0, 1))
                break;
            }
        }
    }
    
    _blendAnimations(anim1, anim2, param) {
        if (this._normalizeClipDuration) {
            let ratio = anim1.duration / anim2.duration
            anim1.playbackSpeed = lerp(1, ratio, param);
            anim2.playbackSpeed = lerp(1 / ratio, 1, param);
        }
        //print(this.weight)
        anim1.weight = 1.0 * this.weight;
        anim2.weight = param * this.weight;
    }

    moveToEnd() {
        this._animations.forEach(anim => {
            anim.clip = putClipAtEndIfNeeded(this.player, anim.name)
        })
    }

    get parameter() {
        return this._parameter;
    }

    // Setter for name
    set parameter(value) {
        this._parameter = value;
    }

    get normalizeClipDuration() {
        return this._normalizeClipDuration
    }

    set normalizeClipDuration(v) {
        this._normalizeClipDuration = v;
        this._blend();
    }

    toString() {
        print(this._animations)
    }
}


module.exports = {
    BlendTree1D,
    putClipAtEndIfNeeded
}