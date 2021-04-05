import { action, observable, IObservableArray } from 'mobx'
import { isEmpty } from 'lodash'
import { readonly } from 'core-decorators';
import { hydrateInstance, modelize, serialize } from 'modeled-mobx'
import { LazyGetter } from 'lazy-get-decorator'
import { ID } from './types'
import { ModelApi } from './model/api'
import Map from './model/map'

export { isApiError, ApiError } from './api/request'

export const NEW_ID: number = 0

export class BaseModel {

    static idField = 'id'

    constructor() {
        modelize(this)
    }

    toJSON() {
        return serialize(this)
    }

    @LazyGetter() get api() { return new ModelApi() }

    get isNew() {
        const id = this[(this.constructor as any).idField]
        return isEmpty(id) || id === NEW_ID
    }

    @action async ensureLoaded(): Promise<void> {
        if (!this.api.isPending && !this.api.hasBeenFetched) {
            return this.fetch()
        }
        return Promise.resolve()
    }

    async fetch(..._args: any[]): Promise<any> {
        throw new Error('fetch called on base model')
    }

    @action update(data: any) {
        hydrateInstance(this, data)
    }

}

export function lazyGetter<T>(target: Object, property: string|symbol, desc: TypedPropertyDescriptor<T>) {
    return LazyGetter()(target, property, desc)
}

export { modelize, readonly, Map }
export type { ID }

// export decorators so they can be easily imported into model classes
export * from 'modeled-mobx'
export { observer } from 'mobx-react'
export {
    computed,
    observable,
    action,
    runInAction,
    flow,
    autorun,
    override,
    flowResult,
    observe,
    when,
} from 'mobx'


export function extendedArray<T, E>(fn?: (_ary: T[]) => E): IObservableArray<T> & E {
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
