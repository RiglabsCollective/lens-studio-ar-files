if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input Component.ScriptComponent bitmoji3D {"label":"Bitmoji 3D"}
// @input Component.Camera camera
// @ui {"widget":"separator"}
// @input bool attachToHead
checkUndefined("attachToHead", []);
// @input bool rotateHead {"showIf":"attachToHead", "showIfValue":false}
checkUndefined("rotateHead", [["attachToHead",false]]);
// @input Asset.ObjectPrefab bitmojiFacePrefab
checkUndefined("bitmojiFacePrefab", []);
// @input Asset.ObjectPrefab lightingPrefab
checkUndefined("lightingPrefab", []);
// @input Asset.ObjectPrefab occluderPrefab
checkUndefined("occluderPrefab", []);
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
var Module = require("../../../../Modules/Src/Assets/Bitmoji Head.lsc/Bitmoji Head");
Object.setPrototypeOf(script, Module.BitmojiHead.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
