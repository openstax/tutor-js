import { action, observable, IObservableArray } from 'mobx'
import { isEmpty } from 'lodash'
import { readonly } from 'core-decorators';
import { modelize, serialize } from 'modeled-mobx'
import { LazyGetter as lazyGetter } from 'lazy-get-decorator'
import { ID } from './types'
import { ModelApi } from './model/api'

export const NEW_ID = 0

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

    @lazyGetter() get api() { return new ModelApi() }

    get isNew() {
        const id = this[(this.constructor as any).idField]
        return isEmpty(id) || id === NEW_ID
    }

    @action ensureLoaded() {
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

export { lazyGetter, modelize, readonly }
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

export function extendedArray<M, E = Record<string, any>>(extensions: E): IObservableArray<M> & E {
    const v = observable.array<M>()
    Object.assign(v, extensions)
    return v as IObservableArray<M> & E
}
