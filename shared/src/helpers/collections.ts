
import {  observable, IObservableArray, ObservableMap } from 'mobx'
import { ID } from '../types'

function array<T>(): IObservableArray<T>  // eslint-disable-line
function array<T, E>(fn: (_ary: T[]) => E): IObservableArray<T> & E  // eslint-disable-line
function array<T, E>(fn?: (_ary: T[]) => E): IObservableArray<T> & E {  // eslint-disable-line
    const ary = observable.array<T>()
    if (fn) {
        const extensions = fn(ary)
        Object.keys(extensions).forEach(prop => {
            const desc = Object.getOwnPropertyDescriptor(extensions, prop) as PropertyDescriptor
            Object.defineProperty(ary, prop, desc)
        })
    }
    return ary as IObservableArray<T> & E
}


function map<V, K=ID>(): ObservableMap<K,V>  // eslint-disable-line
function map<V, E, K=ID>(fn: (_m: ObservableMap<K, V>) => E): ObservableMap<K, V> & E  // eslint-disable-line
function map<V, E, K=ID>(fn?: (_m: ObservableMap<K, V>) => E): ObservableMap<K, V> & E {  // eslint-disable-line
    const m = observable.map<K, V>({}, { deep: false })
    if (fn) {
        const extensions = fn(m)
        Object.keys(extensions).forEach(prop => {
            const desc = Object.getOwnPropertyDescriptor(extensions, prop) as PropertyDescriptor
            Object.defineProperty(m, prop, desc)
        })
    }
    return m as ObservableMap<K,V> & E
}

export { array, map }
