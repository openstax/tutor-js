import { computed, action } from 'mobx'
import { isNil } from 'lodash'
import { modelize, serialize, field } from 'modeled-mobx'
import { LazyGetter as lazyGetter } from 'lazy-get-decorator'
import { ID } from '../types'
import { ModelApi } from './model/api'
import { MapableObject } from './model/map'

export const NEW_ID = 0

export class BaseModel implements MapableObject {

    static idField = 'id'

    @field id: ID = NEW_ID

    constructor(attrs: any) {
        modelize(this)
        if (attrs) { this.update(attrs) }
    }

    update(attrs: any) {
        for (const [key, value] of Object.entries(attrs)) {
            this[key] = value
        }
    }

    toJSON() {
        return serialize(this)
    }

    @lazyGetter() get api() { return new ModelApi() }

    @computed get isNew() {
        const id = this[(this.constructor as any).idField]
        return isNil(id) || id === 0
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

export { lazyGetter, modelize }

// export decorators so they can be easily imported into model classes
export {
    serialize, hydrate, model, field,
} from 'modeled-mobx'

export {
    computed,
    observable,
    action,
} from 'mobx'
