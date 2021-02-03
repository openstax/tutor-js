import { createAsyncThunk } from '@reduxjs/toolkit'
import { template } from 'lodash'
import { Course, Offering } from './types'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type RequestOptions = { params?: any, data?: any }
type RequestReducerFunc<T> = (obj: T) => RequestOptions

type Collection<T> = {
    items: T[]
}

class ApiError extends Error {
    request: string
    requestOptions: RequestOptions
    apiResponse: Response

    constructor(request: string, opts: RequestOptions, resp: Response) {
        super(resp.statusText)
        this.request = request
        this.requestOptions = opts
        this.apiResponse = resp
    }
}

export const request = async <RetT>(method: HttpMethod, urlPattern: string, opts: RequestOptions): Promise<RetT> => {
    let req = { method }
    if(opts?.data) {
        req.body = JSON.stringify(opts.data)
    }
    const url = template(urlPattern)(opts?.params || {})
    const resp = await fetch(`/api/${url}`, req)
    if (resp.ok) {
        return await resp.json() as RetT
    }
    throw new ApiError(`${method} ${url}`, opts, resp)
}

const r = <ArgT, RetT>(method: HttpMethod, urlPattern: string, storePath: string, reducer: RequestReducerFunc<ArgT>) => {
    return createAsyncThunk<RetT, ArgT>(storePath, async (obj: ArgT) => request(method, urlPattern, reducer ? reducer(obj) : undefined))
}


// URLS do not include /api/ prefix.  the request method below will add it

export const updateCourse = r<Course, Course>('PUT', 'courses/${id}', 'courses/updateCourse', (c: Course) => ({
    params: { id: c.id }, data: { name: c.name }, // TODO include other updateable properties
}))

export const getOfferings = r<Offering, Collection<Offering>>('GET', 'offerings', 'offerings/getOfferings')
