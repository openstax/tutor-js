export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestOptions = { method?: HttpMethod }

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

const HttpMethodMatcher = /^(GET|POST|PATCH|PUT|DELETE)\s+/

export const request = async<RetT>(
    url: string,
    data?: any,
    opts: RequestOptions = {}
): Promise<RetT> => {
    let method = opts.method || 'GET'
    const methodMatch = url.match(HttpMethodMatcher)
    if (methodMatch) {
        method = methodMatch[1] as HttpMethod
        url = url.replace(HttpMethodMatcher, '')
    }
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
