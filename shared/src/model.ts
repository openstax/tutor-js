import { action, observable, IObservableArray } from 'mobx'
import { isEmpty } from 'lodash'
import { readonly } from 'core-decorators';
import { modelize, serialize } from 'modeled-mobx'
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

    @action onApiRequestComplete({ data }: { data: any }) {
        this.api.errors = {}
        this.update(data)
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

export {
    computed,
    observable,
    action,
    runInAction,
    flow,
    autorun,
    flowResult,
} from 'mobx'

interface ModelClass extends Function {
    new(...args: any[]): any;
}


export function extendedArray<T>(fn: (a: T[]) => E): IObservableArray<T> & E {
    const a = observable.array<T>()
    Object.assign(a, fn(a))
    return a as IObservableArray<T> & E
}
