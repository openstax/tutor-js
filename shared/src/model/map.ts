import { observable, computed, action } from 'mobx';
import { isArray, isObject } from 'lodash';
import ModelApi from './api';

export type KeyType = string | number

export interface MapableObject {
    id: KeyType
    update(data: any): void
}

export default class Map<V extends MapableObject> {

    static toObject(map: any) {
        const obj = {};
        for (let prop of map) {
            obj[prop[0]] = prop[1];
        }
        return obj;
    }

    keyType = Number

    _map = observable.map<KeyType, V>()

    constructor(data?: any, options = {}) {
        Object.assign(this, options);
        if (isArray(data)) {
            this.mergeModelData(data);
        } else if (isObject(data)) {
            this._map.merge(data);
        }
    }

    @action ensureLoaded() {
        if (!this.api.isPending && !this.api.hasBeenFetched) {
            return this.fetch();
        }
        return Promise.resolve();
    }

    fetch() { } // will be overwritten by api

    @computed get array(): Array<V> {
        return this.values();
    }

    get toObject() {
        return Map.toObject(this._map);
    }

    keys() {
        return Array.from(this._map.keys());
    }

    values() {
        return Array.from(this._map.values());
    }

    has(key: KeyType) {
        return this._map.has(this.keyType(key));
    }

    get(key: KeyType) {
        return this._map.get(this.keyType(key));
    }

    set(key: KeyType, value: V) {
        return this._map.set(this.keyType(key), value);
    }

    delete(key: KeyType) {
        return this._map.delete(this.keyType(key));
    }

    where(condition: (model: V) => boolean) {
        const map = new (<typeof Map>this.constructor)(this.chainedValues, { keyType: this.keyType });
        this._map.forEach(c => {
            if (condition(c)) { map.set(c.id, c); }
        });
        return map;
    }

    get chainedValues() {
        return {};
    }

    @computed get size() {
        return this._map.size;
    }

    @computed get isEmpty() {
        return this._map.size === 0;
    }

    @computed get any() {
        return !this.isEmpty;
    }

    @action merge(obj: any) {
        return this._map.merge(obj);
    }

    get api(): ModelApi {
        const api = new ModelApi();
        Object.defineProperty(this, 'api', { value: api, writable: false });
        return api
    }

    @action mergeModelData(data: any) {
        data.forEach((modelData: V) => {
            const model = this.get(modelData.id);
            model ? (model as any).update(modelData) : this.set(
                modelData.id,
                new (this.constructor as any).Model(modelData, this)
            );
        });
    }

    @action reset() {
        this.clear();
        this.api.reset();
    }

    forEach(callback: (value: V, key: KeyType, object: Map<V>) => void, thisArg?: any) {
        this._map.forEach(callback as any, thisArg)
    }

    replace(values: any) {
        return this._map.replace(values)
    }
    clear() {
        return this._map.clear()
    }
}

