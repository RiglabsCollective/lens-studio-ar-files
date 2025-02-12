"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneHelper = void 0;
class SceneHelper {
    static setRenderLayerRecursively(so, layer) {
        so.layer = layer;
        let child;
        for (let i = 0; i < so.getChildrenCount(); i++) {
            child = so.getChild(i);
            SceneHelper.setRenderLayerRecursively(child, layer);
        }
    }
    static setRenderOrderRecursively(so, renderOrder) {
        const visuals = so.getComponents('Visual');
        for (const visual of visuals) {
            visual.setRenderOrder(renderOrder);
        }
        for (let i = 0; i < so.getChildrenCount(); i++) {
            SceneHelper.setRenderOrderRecursively(so.getChild(i), renderOrder);
        }
    }
    static getComponentRecursively(so, componentType) {
        const component = so.getComponent(componentType);
        if (component) {
            return component;
        }
        const childCount = so.getChildrenCount();
        for (let i = 0; i < childCount; i++) {
            const result = SceneHelper.getComponentRecursively(so.getChild(i), componentType);
            if (result) {
                return result;
            }
        }
        return null;
    }
    static getCameraRenderOrder(so) {
        if (!so) {
            print('Warning! Please, add component to hierarchy within orthographic camera.');
            return -1;
        }
        const camera = so.getComponent('Component.Camera');
        if (camera) {
            return camera.renderOrder;
        }
        else {
            return SceneHelper.getCameraRenderOrder(so.getParent());
        }
    }
    static findChildObjectWithNameRecursively(so, childName) {
        const childCount = so.getChildrenCount();
        for (let i = 0; i < childCount; i++) {
            const child = so.getChild(i);
            if (child.name == childName) {
                return child;
            }
            const result = SceneHelper.findChildObjectWithNameRecursively(child, childName);
            if (result) {
                return result;
            }
        }
        return null;
    }
}
exports.SceneHelper = SceneHelper;
//# sourceMappingURL=SceneHelper.js.map