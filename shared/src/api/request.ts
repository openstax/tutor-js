import interpolate from 'interpolate'
import qs from 'qs';
import { CustomError } from 'ts-custom-error'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestOptions = { data?: any, origin?: string, ignoreErrors?: boolean }
export type NoThrowOptions = { data?: any, origin?: string, ignoreErrors?: boolean, nothrow: true }

export type MethodUrl = [HttpMethod, string]

export interface ApiErrorData {
    code: string
    message: string
    data?: any
}

export function r<P, Q=Record<string, any>>(method: HttpMethod, pattern: string) {
    return (params?: P, query?: Q) => {
        let url = params ? interpolate(pattern, params) : pattern
        if (query) {
            url += '?' + qs.stringify(query, { arrayFormat: 'brackets', encode: true })
        }
        return [method, interpolate(url, params)] as MethodUrl
    }
}

// export a function that accepts a property from api definitions,
// the paramters and the query string needed to build it's url
export function makeUrlFunc<T extends Record<string, any>>(definitions: T) {
    return function<K extends keyof T>(
        key: K,
        params?: Parameters<T[K]>[0],
        query?: Parameters<T[K]>[1],
    ) {
        const methodUrl = definitions[key](params, query)
        return { key, methodUrl }
    }
}

export class ApiError extends CustomError {
    request?: string
    requestOptions?: RequestOptions
    apiResponse?: Response
    data?: ApiErrorData
    isHidden = false
    occuredAt = new Date()

    static fromMessage(request: string, message: string, data?: ApiErrorData) {
        const err = new ApiError(`${request} failed with ${message}`)
        err.request = request
        err.data = data
        return err
    }

    static fromError(request: string, resp: Response, options?: RequestOptions) {
        const err = new ApiError(`${request} failed with ${resp.status}: ${resp.statusText}`)
        err.request = request
        err.requestOptions = options || {}
        err.apiResponse = resp
        return err
    }

    preventDefault() {
        this.isHidden = true
    }

}

export function isApiError(err: any): err is ApiError {
    return err instanceof ApiError
}

const baseUrl = process.env.BACKEND_SERVER_URL ?
    process.env.BACKEND_SERVER_URL : window.location.port === '8000' ?
        'http://localhost:3001/api' : `${window.location.origin}/api`;


async function request<RetT>(methodUrl: MethodUrl, options: NoThrowOptions): Promise<RetT | ApiError> // eslint-disable-line
async function request<RetT>(methodUrl: MethodUrl, options?: RequestOptions): Promise<RetT> // eslint-disable-line
async function request<RetT>(methodUrl: MethodUrl, options?: any): Promise<RetT|ApiError> {  // eslint-disable-line
    const [method, url] = methodUrl
    try {
        let req: { method: string, body?: any, headers?: any } = { method }
        req.headers = { 'Content-Type': 'application/json' }
        if (options?.data) {
            req.body = JSON.stringify(options.data)
        }
        const origin = options?.origin || baseUrl
        const resp = await fetch(`${origin}/${url}`, req)

        if (resp.ok) {
            if (resp.status == 204) { // no content
                return {} as RetT
            }
            const respJson = await resp.json()
            return await respJson as RetT
        } else {
            const err = ApiError.fromError(`${method} api/${url}`, resp, options)
            try {
                const respJson = await resp.json()
                if (respJson && respJson.errors) {
                    err.data = respJson.errors[0]
                }
            } catch { } // eslint-disable-line no-empty
            throw err
        }
    } catch (err) {
        const apiErr = (err instanceof ApiError) ? err : ApiError.fromError(`${method} api/${url}`, { status: 418, statusText: String(err) } as Response, options)
        if  (options?.nothrow) {
            return apiErr
        }
        throw apiErr
    }

}

export { request }
