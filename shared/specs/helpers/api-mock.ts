import { FetchMock, MockResponseInitFunction } from 'jest-fetch-mock';
import { map } from 'lodash';
import { JSON } from '../../src/types'

const fetchMock = fetch as FetchMock;

interface FetchMocks {
    [match: string]: JSON | [JSON] | MockResponseInitFunction
}

type Matcher = [RegExp, string]

const MockApi = {

    intercept(mocks: FetchMocks) {
        const matchers: Matcher[] = map(mocks, (_value:any, key: string) => ( [ new RegExp(key), key ] ))
        const findMatch = (url: string) => matchers.find(
            ([r, _key]) => url.match(r)
        )?.[1]

        beforeEach(() => {
            const mock = async (req: Request) => {
                const mockKey = findMatch(req.url)
                if (mockKey) {
                    const mock  = mocks[mockKey]
                    const body = typeof mock == 'function' ? await mock(req) : mock
                    return Promise.resolve(JSON.stringify(body))
                }
                return Promise.reject(new Error(`unmocked url ${req.url}`))
            }
            fetchMock.mockResponse(mock)
        })

        afterEach(() => fetchMock.resetMocks())
    },

};

export default MockApi;
