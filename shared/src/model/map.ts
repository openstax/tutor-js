import { modelize } from 'modeled-mobx'
import { observable, computed, action } from 'mobx'
import { isArray, isObject } from 'lodash'
import { ModelApi } from './api'
import { hydrateModel } from 'modeled-mobx'
import { ID } from '../types'
import { LazyGetter } from 'lazy-get-decorator'

export * from 'modeled-mobx'
export type { ID }

export interface MapableObject {
    id: ID
    update(data: any): void // eslint-disable-line no-unused-vars
}

export default class Map<K extends ID, V extends MapableObject> {

    keyType = Number

    _map = observable.map<K, V>()

    static toObject(map: any) {
        const obj = {};
        for(let prop of map){
            obj[prop[0]] = prop[1];
        }
        return obj;
    }

    constructor(data: Array<object> | object = {}, options = {}) {
        modelize(this)
        Object.assign(this, options)
        if (isArray(data)) {
            this.mergeModelData(data)
        } else if (isObject(data)) {
            this._map.merge(data)
        }
    }

    async ensureLoaded(..._args: any[]): Promise<any> {
        if (!this.api.isPending && !this.api.hasBeenFetched) {
            return this.fetch()
        }
        return Promise.resolve()
    }

    async fetch(..._args: any[]): Promise<any> {
        throw new Error('abstract map.fetch method called, should be overriden')
    }

    @computed get array() {
        return this.values()
    }

    coerceKey(k: ID): K {
        return this.keyType(k) as any as K // inherited class will do more
    }

    coerceValue(v: V): V {
        const M = (this.constructor as any).Model
        if (!M || v instanceof M) {
            return v
        }
        return hydrateModel(M, v, this)
    }

    keys() {
        return Array.from(this._map.keys())
    }

    values() {
        return Array.from(this._map.values())
    }

    has(key: ID) {
        return this._map.has(this.coerceKey(key))
    }

    get(key: ID) {
        return this._map.get(this.coerceKey(key))
    }

    set(key: ID, value: V) {
        return this._map.set(this.coerceKey(key), this.coerceValue(value))
    }

    delete(key: ID) {
        return this._map.delete(this.coerceKey(key))
    }

    where(condition: (val: V) => boolean): any { // eslint-disable-line no-unused-vars
        const map = new (this.constructor as any)(this.chainedValues, { keyType: this.keyType }) as Map<K, V>
        this._map.forEach(((c: V) => {
            if (condition(c)) { map.set(c.id, c) }
        }))
        return map
    }

    get chainedValues() {
        return {}
    }

    @computed get size() {
        return this._map.size
    }

    @computed get isEmpty() {
        return this._map.size === 0
    }

    @computed get any() {
        return !this.isEmpty
    }

    @action merge(obj: any) {
        return this._map.merge(obj)
    }

    @LazyGetter() get api() { return new ModelApi() }

    @action mergeModelData(data: any) {
        data.forEach((modelData: V) => {
            const model = this.get(modelData.id)
            model ? (model as any).update(modelData) : this.set(
                this.coerceKey(modelData.id) as any, this.coerceValue(modelData)
            )
        })
    }

    @action reset() {
        this.clear()
        this.api.reset()
    }

    // eslint-disable-next-line no-unused-vars
    forEach(callback: (value: V, key: K, object: Map<K, V>) => void, thisArg?: any) {
        this._map.forEach(callback as any, thisArg)
    }

    replace(values: any) {
        return this._map.replace(values)
    }

    clear() {
        return this._map.clear()
    }
    toJSON() {
        return this._map.toJSON()
    }
}
