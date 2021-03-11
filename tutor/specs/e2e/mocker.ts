
import FactoryBot from 'object-factory-bot'
import { Page, Route, Request } from 'playwright-core'
import { pathToRegexp, regexpToFunction, Key } from 'path-to-regexp'
import '../factories/bootstrap'
import { Course } from '../../src/store/types'

export interface JSON {
    readonly [text: string]: JSON | JSON[] | string | number | boolean
}

interface MockedActivity {
    [key: string]: JSON
}

interface HandlerFnParams<T> {
    params: Record<string, string>,
    request: Request,
    route: Route,
    url: string,
    mock: Mock<T>,
}
type HandlerFn<T> = (_opts: HandlerFnParams<T>) => Promise<JSON | null>


type DataFn<T> = (_id: string, _mock: Mock<T>) => JSON | JSON[]

interface Mocks<T> {
    data: Record<string, DataFn<T>>
    handlers: Record<string, HandlerFn<T> | JSON>
}


interface MockOptions {
    is_teacher?: boolean
}

type InstalledHandler = [RegExp, (_route: Route, _request: Request) => void]

const BOOTSTRAP_URL = '/api/user/bootstrap'

type ID = string | number

class Mock<T> {
    mocks: Mocks<T>
    page: Page
    options: MockOptions
    handlers: InstalledHandler[] = []
    activity: MockedActivity = {}
    recordedData: Record<string, Record<string, JSON>> = {}

    constructor(page: Page, mocks: Mocks<T>, options: MockOptions) {
        this.page = page
        this.mocks = mocks
        this.options = options || { data: {} }
        const bsMatch = `GET ${BOOTSTRAP_URL}`
        if (!this.mocks[bsMatch]) {
            this.mocks[bsMatch] = FactoryBot.create('BootstrapData', { is_teacher: this.options.is_teacher || true })
        }
    }

    course(id: ID): Course {
        const bs = this.activity[BOOTSTRAP_URL] as any
        return bs.courses.find((c: Course) => c.id == id)
    }

    data(key: string, id: ID = '') {
        if (this.recordedData[key] && this.recordedData[key][id]) {
            return this.recordedData[key][id]
        }
        if (!this.recordedData[key]) {
            this.recordedData[key] = {}
        }
        return this.recordedData[key][id] = this.options[key](id, this)
    }
}


export const Mocker = {

    mock<T extends Mocks<T>>(page: Page, mocks: T, options: MockOptions = {}) {

        const mock = new Mock<T>(page, mocks, options)

        beforeEach(async () => {
            await this.start(mock)
        })
        afterEach(async () => {
            await this.stop(mock)
        })
    },

    async start<T>(mock: Mock<T>) {

        const routes = Object.entries(mock.mocks.handlers).map(([urlMethodPattern, handler]) => {

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

    async stop<T>(mock: Mock<T>) {
        await Promise.all(
            mock.handlers.map(([url, handler]) => mock.page.unroute(url, handler))
        )
        mock.handlers = []
    },
}
