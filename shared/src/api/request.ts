import interpolate from 'interpolate'
import qs from 'qs';
import { CustomError } from 'ts-custom-error'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestOptions = { data?: any, origin?: string }
export type NoThrowOptions = { data?: any, origin?: string, nothrow: true }

export type MethodUrl = [HttpMethod, string]


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
    request: string
    requestOptions: RequestOptions
    apiResponse: Response

    isHidden = false

    constructor(request: string, resp: Response, options?: RequestOptions) {
        super(`${request} failed with ${resp.status}: ${resp.statusText}`)
        this.request = request
        this.requestOptions = options || {}
        this.apiResponse = resp
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
        let req: { method: string, body?: any } = { method }
        if (options?.data) {
            req.body = JSON.stringify(options.data)
        }
        const origin = options?.origin || baseUrl
        const resp = await fetch(`${origin}/${url}`, req)
        if (resp.ok) {
            const respJson = await resp.json()
            return await respJson as RetT
        } else {
            throw new ApiError(`${method} ${url}`, resp, options)
        }
    } catch (err) {
        const apiErr = (err instanceof ApiError) ? err : new ApiError(`${method} ${url}`, { status: 418, statusText: String(err) } as Response, options)
        if  (options?.nothrow) {
            return apiErr
        }
        throw apiErr

    }

}

export { request }
