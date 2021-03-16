import { first, template } from 'lodash'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type RequestOptions = { params?: any, data?: any }
type RequestReducerFunc<T> = (obj: T) => RequestOptions // eslint-disable-line no-unused-vars

type Collection<T> = {
    items: T[]
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

export const request = async <RetT>(method: HttpMethod, urlPattern: string, opts?: RequestOptions): Promise<RetT> => {
    let req: { method: HttpMethod, body?: any } = { method }
    if (opts?.data) {
        req.body = JSON.stringify(opts.data)
    }
    const url = template(urlPattern)(opts?.params || {})
    const resp = await fetch(`${baseUrl}/${url}`, req)
    const respJson = await resp.json()
    if (resp.ok) {
        return await respJson as RetT
    }

    throw new ApiError(`${method} ${url}`, resp, opts)
}

