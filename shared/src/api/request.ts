import interpolate from 'interpolate'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestOptions = { method?: HttpMethod }

export type MethodUrl = [HttpMethod, string]

export function r<P>(method: HttpMethod, url: string) {
    return [method, (params: P) => interpolate(url, params)]
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
