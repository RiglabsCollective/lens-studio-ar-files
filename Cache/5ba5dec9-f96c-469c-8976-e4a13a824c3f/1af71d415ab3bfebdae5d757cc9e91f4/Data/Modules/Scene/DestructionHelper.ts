export class DestructionHelper {
    objectsToDestroy: (SceneObject | Component)[] = [];

    destroyObjects(): void {
        this.objectsToDestroy.forEach((obj: SceneObject | Component) => {
            if (!isNull(obj) && obj.destroy) {
                obj.destroy();
            }
        });
        this.objectsToDestroy = [];
    }

    getOrAddComponent<K extends keyof ComponentNameMap>(so: SceneObject, componentType: K): ComponentNameMap[K] {
        const component: ComponentNameMap[K] = so.getComponent(componentType);
        if (isNull(component)) {
            return this.createComponent(so, componentType);
        }
        return component;
    }

    addOrOverrideComponent<K extends keyof ComponentNameMap>(so: SceneObject, componentType: K): ComponentNameMap[K] {
        const component: ComponentNameMap[K] = so.getComponent(componentType);
        if (!isNull(component)) {
            component.destroy();
        }
        return this.createComponent(so, componentType);
    }

    createSceneObject(parent?: SceneObject, name?: string): SceneObject {
        const so: SceneObject = global.scene.createSceneObject(name ? name : '');
        so.setParent(parent ? parent : null);
        this.objectsToDestroy.push(so);
        return so;
    }

    createComponent<K extends keyof ComponentNameMap>(so: SceneObject, componentType: K): ComponentNameMap[K] {
        const component: ComponentNameMap[K] = so.createComponent(componentType);
        this.objectsToDestroy.push(component);
        return component;
    }

    createExtentsTarget(parent: SceneObject, visual: BaseMeshVisual, name: string): SceneObject {
        const extentsSO: SceneObject = this.createSceneObject(parent, name);
        visual.extentsTarget = this.createComponent(extentsSO, 'ScreenTransform');
        return extentsSO;
    }

    instantiatePrefab(prefab: ObjectPrefab, parent: SceneObject, name: string): SceneObject {
        const so: SceneObject = prefab.instantiate(parent);
        so.name = name;
        this.objectsToDestroy.push(so);
        return so;
    }
}
