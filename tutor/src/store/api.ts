import { createAsyncThunk } from '@reduxjs/toolkit'
import { template } from 'lodash'
import { Course, Offering } from './types'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type RequestOptions = { params?: any, data?: any }
type RequestReducerFunc<T> = (obj: T) => RequestOptions

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

export const request = async <RetT>(method: HttpMethod, urlPattern: string, opts: RequestOptions): Promise<any> => {
    const { params, data } = opts
    const url = template(urlPattern)(params || {})
    const resp = await fetch(`/api/${url}`, {
        method,
        body: JSON.stringify(data),
    })
    if (resp.ok) {
        return await resp.json() as RetT
    }
    throw new ApiError(`${method} ${url}`, opts, resp)
}

const r = <ArgT, RetT>(method: HttpMethod, urlPattern: string, storePath: string, reducer: RequestReducerFunc<ArgT>) => {
    console.log('here')
    return createAsyncThunk<RetT, ArgT>(storePath, async (obj: ArgT) => request(method, urlPattern, reducer(obj)))
}


// URLS do not include /api/ prefix.  the request method below will add it

export const updateCourse = r<Course, Course>('PUT', 'courses/${id}', 'courses/updateCourse', (c: Course) => ({
    params: { id: c.id }, data: { name: c.name }, // TODO include other updateable properties
}))

export const getOfferings = r<Offering, Offering>('GET', 'offerings', 'offerings/getOfferings')
