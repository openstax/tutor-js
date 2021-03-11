
import FactoryBot from 'object-factory-bot'
import { Page, Route, Request } from 'playwright-core'
import { pathToRegexp, regexpToFunction, Key } from 'path-to-regexp'
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
    request: Request,
    route: Route,
    url: string,
    mock: Mock,
}

type HandlerFn = (_opts: HandlerFnParams) => Promise<JSONOrArray | null>

type DataFn = (_id: string, _mock: Mock) => JSONOrArray

type Routes = Record<string, HandlerFn | JSON>
type MockData = Record<string, DataFn>

//     {
//     data:
//     handlers: Record<string, HandlerFn | JSON>
// }

interface MockOptions {
    is_teacher?: boolean
}

type InstalledHandler = [RegExp, (_route: Route, _request: Request) => void]

const BOOTSTRAP_URL = '/api/user/bootstrap'

type ID = string | number


interface MockArgs {
    page: Page
    routes: Routes
    data?: MockData
    options?: MockOptions
}

const BOOTSTRAP_ROUTE = `GET ${BOOTSTRAP_URL}`

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


        if (!this.routes[BOOTSTRAP_ROUTE]) {
            this.routes[BOOTSTRAP_ROUTE] = FactoryBot.create('BootstrapData', { is_teacher: this.options.is_teacher || true })
        }
    }

    course(id: ID): Course {
        const bs = this.activity[BOOTSTRAP_URL] as any
        return bs.courses.find((c: Course) => c.id == id)
    }

    // _dataGetter
}

export const Mocker = {

    mock(args: MockArgs) {
        //    page: Page, mocks: Mocks, data: MockData) {

        const mock = new Mock(args)

        beforeEach(async () => {
            await this.start(mock)
        })
        afterEach(async () => {
            await this.stop(mock)
        })
    },

    async start(mock: Mock) {

        const routes = Object.entries(mock.routes).map(([urlMethodPattern, handler]) => {

            const keys: Key[] = []
            const opts = { start: false, end: false }
            const [method, urlPattern] = urlMethodPattern.split(' ')

            const urlMatcher = pathToRegexp(urlPattern, keys, opts)
            const urlSplitter = regexpToFunction(urlMatcher, keys as any, opts as any)

            const urlHandler = async (route: Route, request: Request) => {
                if (request.method() != method) {
                    return route.abort()
                }
                const url = request.url()

                const splitUrl = urlSplitter(url)

                const json = typeof handler == 'function' ? await handler({
                    url,
                    mock,
                    params: (splitUrl ? splitUrl.params : {}) as Record<string, string>,
                    request,
                    route,
                }) : handler

                if (json) {
                    mock.activity[urlPattern] = json

                    route.fulfill({
                        body: JSON.stringify(json),
                        headers: {
                            'x-app-date': (new Date()).toISOString(),
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                        },
                    })
                } else {
                    route.abort()
                }
            }
            mock.handlers.push([urlMatcher, urlHandler])
            return mock.page.route(urlMatcher, urlHandler)
        })
        return Promise.all(routes)
    },

    async stop(mock: Mock) {
        await Promise.all(
            mock.handlers.map(([url, handler]) => mock.page.unroute(url, handler))
        )
        mock.handlers = []
    },
}
