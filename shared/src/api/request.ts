import interpolate from 'interpolate'
import qs from 'qs';
import { CustomError } from 'ts-custom-error'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestOptions = { nothrow?: boolean }
export type NoThrowOptions = { nothrow: true }

export type MethodUrl = [HttpMethod, string]


export function r<P, Q=Record<string, any>>(method: HttpMethod, url: string) {
    return (params?: P, query?: Q) => {
        if (params) {
            url = interpolate(url, params)
        }
        if (query) {
            url += '?' + qs.stringify(query, { arrayFormat: 'brackets', encode: false })
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

    constructor(request: string, resp: Response, options?: RequestOptions) {
        super(`${resp.status}: ${resp.statusText}`)
        this.request = request
        this.requestOptions = options || {}
        this.apiResponse = resp
    }
}

export function isApiError(err: any): err is ApiError {
    return err instanceof ApiError
}

const baseUrl = process.env.BACKEND_SERVER_URL ?
    process.env.BACKEND_SERVER_URL : window.location.port === '8000' ?
        'http://localhost:3001/api' : `${window.location.origin}/api`;


async function request<RetT>(methodUrl: MethodUrl, data: any, options: NoThrowOptions): Promise<RetT | ApiError> // eslint-disable-line
async function request<RetT>(methodUrl: MethodUrl, data?: any, options?: any): Promise<RetT> // eslint-disable-line
async function request<RetT>(methodUrl: MethodUrl, data?: any, options?: RequestOptions): Promise<RetT|ApiError> {  // eslint-disable-line
    const [method, url] = methodUrl
    let req: { method: string, body?: any } = { method }
    if (data) {
        req.body = JSON.stringify(data)
    }
    try {
        const resp = await fetch(`${baseUrl}/${url}`, req)
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
