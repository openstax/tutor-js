import { BaseModel, hydrateModel, modelize, field, isApiError, ApiError } from 'shared/model'

describe('model api class', () => {
    class Foo extends BaseModel {
        @field name = ''
        constructor() {
            super();
            modelize(this);
        }
    }

    let model: Foo

    beforeEach(() => {
        model  = hydrateModel(Foo, { name: 'a model' })
    })

    it('throws by default', async () => {
        fetchMock.mockResponseOnce('bad! bad! bad!', { status: 511, statusText: 'no!' })
        expect(async () => {
            await model.api.request<{ name: string }>({ key: 'fetch', methodUrl: ['GET', 'something'] })
        }).toThrowError(ApiError)
    })

    it('tracks loading status', async () => {
        fetchMock.mockResponseOnce(() => new Promise((done) => {
            setTimeout(() => done(JSON.stringify({ name: 'from server' })), 10)
        }))
        const replyPromise = model.api.request<{ name: string }>({ key: 'fetch', methodUrl: ['PUT', 'model/bar'] }, { nothrow: true })
        expect(model.api.isPending).toBe(true)
        expect(model.api.requestCounts.update).toEqual(0)
        expect(model.api.isInProgress('fetch')).toBe(true)

        const resp = await replyPromise

        expect(model.api.isInProgress('fetch')).toBe(false)
        expect(model.api.isPending).toBe(false)
        expect(model.api.requestCounts.update).toEqual(1)
        expect(resp.name).toEqual('from server')

        model.api.reset()
        expect(model.api.requestCounts.update).toEqual(0)
    });

    fit('captures errors', async () => {
        fetchMock.mockResponseOnce('bad! bad! bad!', { status: 511, statusText: 'no!' })
        const reply = await model.api.request<{ name: string }>({ key: 'saveThings', methodUrl: ['PUT', 'model/bar'] }, { nothrow: true })
        expect(isApiError(reply)).toBe(true)
        expect(model.api.errors.any).toBe(true)
        expect(model.api.errors.get('saveThings')?.apiResponse?.status).toBe(511)
    })

    it('deals with invalid json', async () => {
        fetchMock.mockResponseOnce('bad! bad! bad!', { status: 201, statusText: 'ok' })
        const reply = await model.api.request<{ name: string }>({ key: 'saveThings', methodUrl: ['PUT', 'model/bar'] }, { nothrow: true })
        expect(isApiError(reply)).toBe(true)
        expect(String(reply)).toMatch(/invalid json/)
    })
})
