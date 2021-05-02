
import Factory from 'object-factory-bot'
import { Page, Route, Request } from 'playwright-core'
import { pathToRegexp, regexpToFunction, Key } from 'path-to-regexp'
import qs from 'qs'
import { defaults, isFunction, clone } from 'lodash'
import '../factories/bootstrap'
import { Course } from '../../src/models'

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
    num_courses?: number
    debug?: boolean
}

type InstalledHandler = [RegExp, (_route: Route, _request: Request) => void]

export const BOOTSTRAP_URL = '/api/user/bootstrap'
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
        this.routes = clone(routes)
        this.mockData = clone(data || {})
        this.options = clone(options || {})
        defaults(this.options, {
            is_teacher: true,
        })
        Factory.resetSequences()
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

    get bootstrapData(): any {
        let bs = this.activity[BOOTSTRAP_URL] as any
        if (!bs && this.routes[BOOTSTRAP_URL]) {
            bs = isFunction(this.routes[BOOTSTRAP_URL]) ?
                (this.routes[BOOTSTRAP_URL] as Function)() : this.routes[BOOTSTRAP_URL]
        }
        return bs
    }

    course(id: ID): Course {
        return this.bootstrapData.courses.find((c: Course) => c.id == id)
    }
}

class MockWrapper {
    _mock: Mock
    _args: MockArgs
    constructor(args: MockArgs) {
        this._args = args
        this._mock = new Mock(this._args)
    }
    get current() {
        return this._mock
    }
    reset() {
        this._mock = new Mock(this._args)
    }
}

export const Mocker = {

    mock(args: MockArgs) {
        const mock = new MockWrapper(args)

        beforeEach(async () => {
            await this.start(mock.current)
        })
        afterEach(async () => {
            await this.stop(mock.current)
            mock.reset()
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
                const json = isFunction(handler) ? await handler({
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
