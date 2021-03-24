import interpolate from 'interpolate'
import qs from 'qs';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestOptions = { method?: HttpMethod }

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

class ApiError extends Error {
    request: string
    requestOptions: RequestOptions
    apiResponse: Response

    constructor(request: string, resp: Response, opts?: RequestOptions) {
        super(resp.statusText)
        this.request = request
        this.requestOptions = opts || {}
        this.apiResponse = resp
    }
}

const baseUrl = process.env.BACKEND_SERVER_URL ?
    process.env.BACKEND_SERVER_URL : window.location.port === '8000' ?
        'http://localhost:3001/api' : `${window.location.origin}/api`;

export const request = async<RetT>(
    methodUrl: MethodUrl,
    data?: any,
    opts: RequestOptions = {}
): Promise<RetT> => {
    const [method, url] = methodUrl
    let req: { method: string, body?: any } = { method }
    if (data) {
        req.body = JSON.stringify(data)
    }
    const resp = await fetch(`${baseUrl}/${url}`, req)
    const respJson = await resp.json()
    if (resp.ok) {
        return await respJson as RetT
    }
    throw new ApiError(`${method} ${url}`, resp, opts)
}
