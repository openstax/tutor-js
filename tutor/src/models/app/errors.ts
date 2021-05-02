import {
    observable, action, modelize, computed,
} from 'shared/model';
import { last } from 'lodash'
import { isApiError } from 'shared/api/request'

export class AppErrors {

    errors = observable.array()

    constructor() {
        modelize(this)
    }

    @action clear() {
        this.errors.clear()
    }

    @action.bound record(err: any) {
        if (!this.errors.includes(err)) {
            this.errors.push(err)
        }
    }

    get latest() {
        return last(this.errors)
    }

    navigation() {
        if (!this.errors.length) { return {} }
        const err = this.latest
        if (isApiError(err)) {
            if (err.apiResponse?.status) {
                return { href: '/' };
            } else {
                return { shouldReload: false };
            }
        }
        return {}
    }

    @action pop() {
        return this.errors.pop()
    }

    @computed get any() {
        return this.errors.length > 0
    }
}


export const currentErrors = new AppErrors
