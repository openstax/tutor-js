import { createAsyncThunk } from '@reduxjs/toolkit'
import { first, template } from 'lodash'
import { Course, ID, Offering } from './types'

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

    if (resp.ok) {
        return await resp.json() as RetT
    }
    throw new ApiError(`${method} ${url}`, resp, opts)
}

const r = <ArgT, RetT>(method: HttpMethod, urlPattern: string, storePath: string, reducer?: RequestReducerFunc<ArgT>) => {
    return createAsyncThunk<RetT, ArgT>(storePath, async (obj: ArgT) => request<RetT>(method, urlPattern, reducer ? reducer(obj) : undefined))
}


// URLS do not include /api/ prefix.  the request method below will add it

export const createPreviewCourse = r<Offering, Course>('POST', 'courses', 'courses/createPreviewCourse', c => {
    const firstActiveYear = first(c.active_term_years)
    if (firstActiveYear) {
        return {
            data: {
                name: c.title,
                is_preview: true,
                offering_id: c.id,
                num_sections: 1,
                term: first(c.active_term_years)?.term,
                year: first(c.active_term_years)?.year,
                timezone: 'US/Central',
                copy_question_library: true,
            },
        }
    }
    throw new Error('Offering does not have a current active term')
})

//Course
export const updateCourse = r<Course, Course>('PUT', 'courses/${id}', 'courses/updateCourse', (course) => ({
    params: { id: course.id }, data: { name: course.name }, // TODO include other updateable properties
}))

export const dropCourseTeacher = r<ID, any>('DELETE', 'teachers/${id}', 'courses/dropCourseTeacher', (roleId) => ({
    params: { id: roleId },
}))

//Offering
export const getOfferings = r<Offering, Collection<Offering>>('GET', 'offerings', 'offerings/getOfferings')
