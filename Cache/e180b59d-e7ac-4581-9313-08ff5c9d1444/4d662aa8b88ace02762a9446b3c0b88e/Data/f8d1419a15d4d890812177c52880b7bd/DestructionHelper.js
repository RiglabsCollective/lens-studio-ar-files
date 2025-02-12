"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestructionHelper = void 0;
class DestructionHelper {
    constructor() {
        this.objectsToDestroy = [];
    }
    destroyObjects() {
        this.objectsToDestroy.forEach((obj) => {
            if (!isNull(obj) && obj.destroy) {
                obj.destroy();
            }
        });
        this.objectsToDestroy = [];
    }
    getOrAddComponent(so, componentType) {
        const component = so.getComponent(componentType);
        if (isNull(component)) {
            return this.createComponent(so, componentType);
        }
        return component;
    }
    addOrOverrideComponent(so, componentType) {
        const component = so.getComponent(componentType);
        if (!isNull(component)) {
            component.destroy();
        }
        return this.createComponent(so, componentType);
    }
    createSceneObject(parent, name) {
        const so = global.scene.createSceneObject(name ? name : '');
        so.setParent(parent ? parent : null);
        this.objectsToDestroy.push(so);
        return so;
    }
    createComponent(so, componentType) {
        const component = so.createComponent(componentType);
        this.objectsToDestroy.push(component);
        return component;
    }
    createExtentsTarget(parent, visual, name) {
        const extentsSO = this.createSceneObject(parent, name);
        visual.extentsTarget = this.createComponent(extentsSO, 'ScreenTransform');
        return extentsSO;
    }
    instantiatePrefab(prefab, parent, name) {
        const so = prefab.instantiate(parent);
        so.name = name;
        this.objectsToDestroy.push(so);
        return so;
    }
}
exports.DestructionHelper = DestructionHelper;
//# sourceMappingURL=DestructionHelper.js.map