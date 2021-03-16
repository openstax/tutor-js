import { modelize } from 'modeled-mobx'
import { observable, computed, action } from 'mobx'
import { isArray, isObject } from 'lodash'
import { ModelApi } from './api'
import { ID } from '../../types'
import { LazyGetter } from 'lazy-get-decorator'

export interface MapableObject {
    id: ID
    update(data: any): void
}

export default class Map<K, V extends MapableObject> {

    keyType = Number

    _map = observable.map<K, V>()

    constructor(data: Array<object> | object = {}, options = {}) {
        modelize(this)
        Object.assign(this, options)
        if (isArray(data)) {
            this.mergeModelData(data)
        } else if (isObject(data)) {
            this._map.merge(data)
        }
    }

    @action ensureLoaded(): Promise<any> {
        if (!this.api.isPending && !this.api.hasBeenFetched) {
            return this.fetch()
        }
        return Promise.resolve()
    }

    fetch(): Promise<any> {
        throw new Error('abstract method, should be overriden')
    }

    @computed get array() {
        return this.values()
    }

    coerceKey(k: ID): K {
        return this.keyType(k) as any as K // inherited class will do more
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
        return this._map.set(this.coerceKey(key), value)
    }

    delete(key: ID) {
        return this._map.delete(this.coerceKey(key))
    }

    where(condition: (val: V) => boolean): Map<K, V> {
        const map = new (this.constructor as any)(this.chainedValues, { keyType: this.keyType })
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
                modelData.id,
                new (this.constructor as any).Model(modelData, this)
            )
        })
    }
    @action reset() {
        this.clear()
        this.api.reset()
    }

    forEach(callback: (value: V, key: KeyType, object: Map<K, V>) => void, thisArg?: any) {
        this._map.forEach(callback as any, thisArg)
    }

    replace(values: any) {
        return this._map.replace(values)
    }
    clear() {
        return this._map.clear()
    }
}
