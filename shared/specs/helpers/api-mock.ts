import { FetchMock, MockResponseInit } from 'jest-fetch-mock';
import { map } from 'lodash';
import { JSON } from '../../src/types'

const fetchMock = fetch as FetchMock;

type MockFn = (_request: Request) => Promise<MockResponseInit | string | Record<string, any>>;

interface FetchMocks {
    [match: string]: JSON | [JSON] | MockFn
}

type Matcher = [RegExp, string]

export const ApiMock = {

    intercept<T extends FetchMocks>(mocks: T) {
        const spys: Record<keyof T, jest.Mock> = {} as any
        beforeEach(() => {
            Object.assign(spys, ApiMock.mock(mocks))
        })

        afterEach(() => fetchMock.resetMocks())
        return spys
    },

    mock<T extends FetchMocks>(mocks: T) {
        const spys: Record<keyof T, jest.Mock> = {} as any
        Object.entries(mocks).forEach(([key, mock]) => {
            spys[key as any] = jest.fn(async (req: Request) => {
                const body = typeof mock == 'function' ? await mock(req) : mock
                return Promise.resolve(JSON.stringify(body))
            })
        })
        const matchers: Matcher[] = map(mocks, (_value:any, key: string) => ( [ new RegExp(key), key ] ))
        const findMatch = (url: string) => matchers.find(
            ([r, _key]) => url.match(r)
        )?.[1]

        const mock = async (req: Request) => {
            const mockKey = findMatch(req.url)
            if (mockKey) {
                return spys[mockKey](req)

                // const mock  = mocks[mockKey]
                // const body = typeof mock == 'function' ? await mock(req) : mock
                // return Promise.resolve(JSON.stringify(body))
            }
            return Promise.reject(new Error(`unmocked url ${req.url}`))
        }
        fetchMock.mockResponse(mock)
        return spys
    },

};
