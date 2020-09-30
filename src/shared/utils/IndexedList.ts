import { AbstractGameObject } from '../gameObjects/00_AbstractGameObject';

export class IndexedList<T extends AbstractGameObject> {
    values: { [key: string]: T } = {};

    addMore(values: { [key: string]: T }) {
        this.values = { ...this.values, ...values };
    }

    add(key: string, value: T) {
        this.values[key] = value;
    }

    remove(key: string) {
        if (!this.values[key]) return;
        this.values[key].detachBabylon();
        delete this.values[key];
    }

    update(key: string, serialized: any, smooth?: boolean) {
        if (!this.values[key]) return;
        this.values[key].deserialize(serialized, smooth);
    }

    updateOrCreate(key: string, serialized: any, newObjectCreator: () => T, smooth?: boolean) {
        if (!this.values[key]) {
            this.values[key] = newObjectCreator();
        }
        this.values[key].deserialize(serialized, smooth);
    }

    get(key: string) {
        if (!this.values[key]) return null;
        return this.values[key];
    }

    includes(key: string) {
        return !!this.values[key];
    }

    forEach(callbackfn: (value: T, key: string, index: number) => void) {
        const keys = Object.keys(this.values);

        keys.forEach((key, index) => {
            callbackfn(this.values[key], key, index);
        });
    }

    filter(callbackfn: (value: T, key: string, index: number) => boolean) {
        const keys = Object.keys(this.values);

        const result = new IndexedList<T>();

        keys.forEach((key, index) => {
            if (callbackfn(this.values[key], key, index)) {
                result.add(key, this.values[key]);
            }
        });

        return result;
    }

    map(callbackfn: (value: T, key: string, index: number) => any) {
        return Object.keys(this.values).map((key, index) => callbackfn(this.values[key], key, index));
    }

    getValues() {
        return Object.values(this.values);
    }

    getKeys() {
        return Object.keys(this.values);
    }

    length() {
        return this.getKeys().length;
    }
}
