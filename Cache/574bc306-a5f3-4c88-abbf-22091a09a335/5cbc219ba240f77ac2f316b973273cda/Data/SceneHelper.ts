export class SceneHelper {
    static setRenderLayerRecursively(so: SceneObject, layer: LayerSet): void {
        so.layer = layer;
        let child: SceneObject;
        for (let i = 0; i < so.getChildrenCount(); i++) {
            child = so.getChild(i);
            SceneHelper.setRenderLayerRecursively(child, layer);
        }
    }

    static setRenderOrderRecursively(so: SceneObject, renderOrder: number): void {
        const visuals: Visual[] = so.getComponents('Visual');
        for (const visual of visuals) {
            visual.setRenderOrder(renderOrder);
        }

        for (let i = 0; i < so.getChildrenCount(); i++) {
            SceneHelper.setRenderOrderRecursively(so.getChild(i), renderOrder);
        }
    }

    static getComponentRecursively<K extends keyof ComponentNameMap>(so: SceneObject, componentType: K): ComponentNameMap[K] {
        const component: ComponentNameMap[K] = so.getComponent(componentType);
        if (component) {
            return component;
        }
        const childCount: number = so.getChildrenCount();
        for (let i = 0; i < childCount; i++) {
            const result: ComponentNameMap[K] = SceneHelper.getComponentRecursively(so.getChild(i), componentType);
            if (result) {
                return result;
            }
        }
        return null;
    }

    static getCameraRenderOrder(so: SceneObject): number {
        if (!so) {
            print('Warning! Please, add component to hierarchy within orthographic camera.');
            return -1;
        }

        const camera: Camera = so.getComponent('Component.Camera');
        if (camera) {
            return camera.renderOrder;
        } else {
            return SceneHelper.getCameraRenderOrder(so.getParent());
        }
    }

    static findChildObjectWithNameRecursively(so: SceneObject, childName: string): SceneObject {
        const childCount: number = so.getChildrenCount();
        for (let i = 0; i < childCount; i++) {
            const child: SceneObject = so.getChild(i);
            if (child.name == childName) {
                return child;
            }
            const result: SceneObject = SceneHelper.findChildObjectWithNameRecursively(child, childName);
            if (result) {
                return result;
            }
        }
        return null;
    }
}
