
import Factory from 'object-factory-bot'
import { Page, Route, Request } from 'playwright-core'
import { pathToRegexp, regexpToFunction, Key } from 'path-to-regexp'
import qs from 'qs'
import { defaults } from 'lodash'
import '../factories/bootstrap'
import { Course } from '../../src/store/types'

export interface JSON {
    readonly [text: string]: JSON | JSON[] | string | number | boolean
}

export type JSONOrArray = JSON | JSON[]

interface MockedActivity {
    [key: string]: JSONOrArray
}

interface HandlerFnParams {
    params: Record<string, string>,
    query: Record<string, any>,
    request: Request,
    route: Route,
    url: string,
    mock: Mock,
}

type HandlerFn = (_opts: HandlerFnParams) => Promise<JSONOrArray | null>

type DataFn = (_id: string, _mock: Mock) => JSONOrArray

type Routes = Record<string, HandlerFn | JSON>
type MockData = Record<string, DataFn>

interface MockOptions {
    feature_flags?: any
    is_teacher?: boolean
    debug?: boolean
}

type InstalledHandler = [RegExp, (_route: Route, _request: Request) => void]

const BOOTSTRAP_URL = '/api/user/bootstrap'
const DASHBOARD_URL = '/api/courses/:courseId/dashboard'
const USER_URL = '/api/user'

type ID = string | number

interface MockArgs {
    page: Page
    routes: Routes
    data?: MockData
    options?: MockOptions
}

const setupDefaultRoutes = (routes: Routes, options: MockOptions) => {

    if (!routes[USER_URL]) {
        routes[USER_URL] = Factory.create('User')
    }
    if (!routes[BOOTSTRAP_URL]) {
        routes[BOOTSTRAP_URL] = Factory.create('BootstrapData', options)
    }
    if (!routes[DASHBOARD_URL]) {
        routes[DASHBOARD_URL] = async ({ mock, params: { courseId } }) => (
            Factory.create('CourseDashboard', { course: mock.course(courseId), ...options })
        )
    }
}

class Mock {
    routes: Routes
    mockData: MockData
    page: Page
    options: MockOptions
    handlers: InstalledHandler[] = []
    activity: MockedActivity = {}
    recordedData: Record<string, Record<string, JSON>> = {}

    data: any

    constructor({ page, routes, data, options }: MockArgs) {
        this.page = page
        this.routes = routes
        this.mockData = data || {}
        this.options = options || {}
        defaults(this.options, {
            is_teacher: true,
        })

        this.data = new Proxy(this.recordedData, {
            get: (target: any, prop: string) => (
                (id: string): any => {

                    if (target[prop] && target[prop][id]) {
                        return target[prop][id]
                    }
                    if (!target[prop]) {
                        target[prop] = {}
                    }
                    return target[prop][id] = this.mockData[prop](id, this)
                }
            ),
        })
        setupDefaultRoutes(this.routes, this.options)
    }

    course(id: ID): Course {
        let bs = this.activity[BOOTSTRAP_URL] as any
        if (!bs && this.routes[BOOTSTRAP_URL]) {
            bs = this.routes[BOOTSTRAP_URL]
        }
        return bs.courses.find((c: Course) => c.id == id)
    }

}

export const Mocker = {

    mock(args: MockArgs) {
        const mock = new Mock(args)
        beforeEach(async () => {
            await this.start(mock)
        })
        afterEach(async () => {
            await this.stop(mock)
        })
        return mock
    },

    async start(mock: Mock) {

        const routes = Object.entries(mock.routes).map(([routePath, handler]) => {

            const keys: Key[] = []
            const opts = { start: false, end: true }
            if (routePath.endsWith('*')) {
                routePath = routePath.replace(/\*$/, '')
                opts.end = false
            }

            const urlMatcher = pathToRegexp(routePath, keys, opts)
            const urlSplitter = regexpToFunction(urlMatcher, keys as any, opts as any)

            const urlHandler = async (route: Route, request: Request) => {
                const url = request.url()
                const splitUrl = urlSplitter(url)
                const json = typeof handler == 'function' ? await handler({
                    url,
                    mock,
                    query: qs.parse(url.split('?')[1]),
                    params: (splitUrl ? splitUrl.params : {}) as Record<string, string>,
                    request,
                    route,
                }) : handler
                if (json) {
                    mock.activity[routePath] = json
                    route.fulfill({
                        body: JSON.stringify(json),
                        headers: {
                            'x-app-date': (new Date()).toISOString(),
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                        },
                    })
                }
            }
            mock.handlers.push([urlMatcher, urlHandler])
            return mock.page.route(urlMatcher, urlHandler)
        })
        mock.page.on('requestfinished', this.onRequestFinish)
        await Promise.all(routes)
    },

    async stop(mock: Mock) {
        mock.page.off('requestfinished', this.onRequestFinish)
        await Promise.all(
            mock.handlers.map(([url, handler]) => mock.page.unroute(url, handler))
        )
        mock.handlers = []
    },

    async onRequestFinish(req: Request) {
        const resp = await req.response()
        // console.log(req.url(), resp?.status())
        if (resp && resp.status() >= 400) {
            throw new Error(`${req.url()} returned status ${resp?.status()}`)
        }
    },

}
