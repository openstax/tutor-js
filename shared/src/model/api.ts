import { modelize } from 'modeled-mobx'
import { observable, computed, action } from 'mobx'
import { readonly } from 'core-decorators'
import { request, ApiUrlPatterns, RequestOptions } from '../api'

export interface ApiError {
    code?: string
}

export interface ApiErrors {
    [k: string]: ApiError
}

export interface ApiErrorResponse {
    isRecorded: boolean
    response?: {
        data?: {
            errors?: {
                code: string
            }[]
        }
    }
}


export class ModelApi<UrlPatternsT extends ApiUrlPatterns> {

    @readonly requestsInProgress = observable.map()

    @readonly requestCounts = observable({
        read: 0,
        create: 0,
        update: 0,
        delete: 0,
    })

    @observable errors: ApiErrors = {}

    constructor() {
        modelize(this)
    }

    @computed get isPending() {
        return this.requestsInProgress.size > 0
    }

    @computed get isDeleted() {
        return this.requestCounts.delete > 0
    }

    @computed get isPendingInitialFetch() {
        return this.isPending && !this.hasBeenFetched
    }

    @computed get isFetchInProgress() {
        return Boolean(this.requestsInProgress.get('read'))
    }

    @computed get isWriteInProgress() {
        return Boolean(
            this.requestsInProgress.get('put') ||
            this.requestsInProgress.get('post') ||
            this.requestsInProgress.get('patch')
        )
    }

    @computed get hasBeenFetched() {
        return Boolean(
            this.requestCounts.read > 0
        )
    }

    @computed get isFetchedOrFetching() {
        return Boolean(this.isFetchInProgress || this.hasBeenFetched)
    }

    @computed get hasErrors() {
        return Boolean(Object.keys(this.errors || {}).length)
    }

    @action reset() {
        Object.keys(this.requestCounts).forEach(k => this.requestCounts[k] = 0)
    }

    _requestFn = request

    async request<RetT>(urlPattern: string, opts?: RequestOptions) {
        return this._requestFn<RetT>(urlPattern, opts)
    }
}
