import { modelize } from 'modeled-mobx'
import { observable, computed, action, runInAction } from 'mobx'
import { readonly } from 'core-decorators'
import { request, MethodUrl, RequestOptions, ApiError } from '../api/request'

const httpMethodToType = {
    GET: 'read',
    POST: 'update',
    PUT: 'update',
    DELETE: 'delete',
}

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

    @action reset() {
        this.errors.clear()
        Object.keys(this.requestCounts).forEach(k => this.requestCounts[k] = 0)
    }

    async request<RetT>(
        { key, methodUrl }: { key: string, methodUrl: MethodUrl },
        data?: any, options?: RequestOptions
    ): Promise<RetT> {
        this.requestsInProgress.set(key, methodUrl)
        try {
            const reply = await request<RetT>(methodUrl, data, options)
            runInAction(() => {
                this.requestsInProgress.delete(key)
                this.requestCounts[httpMethodToType[methodUrl[0]]] += 1
            })
            return reply
        } catch (e) {
            this.errors.set(key, e)
            if (options?.nothrow) {
                // TODO figure out how to change RetT based on nothrow in options
                return e as any as RetT
            }
            throw e
        }
    }
}
