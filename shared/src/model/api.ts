import { modelize } from 'modeled-mobx'
import { observable, computed, action, runInAction } from 'mobx'
import { readonly } from 'core-decorators'
import { request, MethodUrl, NoThrowOptions, RequestOptions, ApiError, isApiError } from '../api/request'

const httpMethodToType = {
    GET: 'read',
    POST: 'update',
    PUT: 'update',
    DELETE: 'delete',
}

type RequestUrlKey = { key: string, methodUrl: MethodUrl }

export class ModelApi {
    @readonly requestsInProgress = observable.map<string,MethodUrl>({}, { deep: false })
    @readonly errors = observable.map<string, ApiError>({}, { deep: false })
    @readonly requestCounts = observable({
        read: 0,
        create: 0,
        update: 0,
        delete: 0,
    })

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

    isInProgress(key: string) {
        return Boolean(this.requestsInProgress.get(key))
    }

    @computed get hasBeenFetched() {
        return Boolean(
            this.requestCounts.read > 0
        )
    }

    @computed get isFetchInProgress() {
        return Array.from(this.requestsInProgress.values()).find(([method]) => method == 'GET')
    }

    @computed get isFetchedOrFetching() {
        return Boolean(this.isFetchInProgress || this.hasBeenFetched)
    }

    @computed get hasErrors() {
        return this.errors.size > 0
    }

    errorWithCode(code: string): ApiError | void {
        for (const err of this.errors.values()) {
            if (err.data?.code == code) {
                return err
            }
        }
    }

    @action reset() {
        this.errors.clear()
        Object.keys(this.requestCounts).forEach(k => this.requestCounts[k] = 0)
    }

    async request<RetT>({ key, methodUrl }: RequestUrlKey, options: NoThrowOptions): Promise<RetT|ApiError> // eslint-disable-line
    async request<RetT>({ key, methodUrl }: RequestUrlKey, options?: RequestOptions): Promise<RetT> // eslint-disable-line
    async request<RetT>({ key, methodUrl }: RequestUrlKey, options?: any): Promise<RetT|ApiError> { // eslint-disable-line
        this.requestsInProgress.set(key, methodUrl)
        try {
            const reply = await request<RetT>(methodUrl, options)
            runInAction(() => {
                this.requestsInProgress.delete(key)
                this.requestCounts[httpMethodToType[methodUrl[0]]] += 1
                if (isApiError(reply)) {
                    this.errors.set(key, reply)
                }
            })
            return reply
        } catch (e) {
            this.errors.set(key, e)
            if (options?.nothrow) {
                return e
            }
            throw e
        }
    }
}
