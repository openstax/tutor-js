import { action, ObservableMap } from 'mobx'
import { isNil } from 'lodash'
import { readonly } from 'core-decorators';
import { hydrateInstance, modelize, serialize } from 'modeled-mobx'
import { LazyGetter } from 'lazy-get-decorator'
import { ID } from './types'
import { ModelApi } from './model/api'
import Map from './model/map'
import { map, array } from './helpers/collections'

export { ModelApi }
export { isApiError, ApiError } from './api/request'
export type { ObservableMap }
export { map, array }
export const NEW_ID: number = 0

export class BaseModel {

    static idField = 'id'

    constructor(data?: any) {
        modelize(this)
        if (data) {
            this.update(data)
        }
    }

    toJSON() {
        return serialize(this)
    }

    @LazyGetter() get api() { return new ModelApi() }

    get isNew() {
        const id = this[(this.constructor as any).idField]
        return isNil(id) || id === NEW_ID || id === ''
    }

    @action async ensureLoaded(): Promise<void> {
        if (!this.api.isPending && !this.api.hasBeenFetched) {
            return this.fetch()
        }
        return Promise.resolve()
    }

    async fetch(..._args: any[]): Promise<any> {
        throw new Error(`fetch called on base model, should be implemented in ${this.constructor.name}`)
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
