import { action, observable, IObservableArray } from 'mobx'
import { isEmpty } from 'lodash'
import { readonly } from 'core-decorators';
import { hydrateInstance, modelize, serialize } from 'modeled-mobx'
import { LazyGetter } from 'lazy-get-decorator'
import { ID } from './types'
import { ModelApi } from './model/api'
import Map from './model/map'

export const NEW_ID: number = 0

export class BaseModel {

    static idField = 'id'

    update(attrs: any) {
        for (const [key, value] of Object.entries(attrs)) {
            this[key] = value
        }
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

    fetch() {
        throw new Error('fetch called on base model')
    }

    @action onApiRequestComplete(data: any) {
        hydrateInstance(this, data)
    }

    // todo: finish impl once fetch api is nailed down
    @action setApiErrors() {

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


export function extendedArray<T, E>(fn: (_ary: T[]) => E): IObservableArray<T> & E {
    const ary = observable.array<T>()
    const extensions = fn(ary)
    Object.keys(extensions).forEach(prop => {
        const desc = Object.getOwnPropertyDescriptor(extensions, prop) as PropertyDescriptor
        Object.defineProperty(ary, prop, desc)
    })
    return ary as IObservableArray<T> & E
}
