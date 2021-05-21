import { fetchMock } from '../helpers'
import { ResponseValidation } from '../../src/models'

describe(ResponseValidation, () => {
    let rv:ResponseValidation;

    beforeEach(() => {
        rv = new ResponseValidation();
        rv.config.url = 'http://test.com/validate';
        rv.config.is_enabled = true;
    })

    it('does not request info when not configured', () => {
        rv.config.url = '';
        fetchMock.mockResponseOnce(JSON.stringify(({})))
        rv.validate({ response: 'test' })
        expect(fetchMock.mock.calls).toHaveLength(0)

        rv = new ResponseValidation();
        rv.config.url = 'http://test.com';
        rv.config.is_enabled = false;
        rv.validate({ response: 'test' })
        expect(fetchMock.mock.calls).toHaveLength(0)
    })

    it('makes request', () => {
        fetchMock.mockResponseOnce(JSON.stringify(({})))
        rv.validate({ response: 'this is a test', uid: '123@4' })
        expect(fetchMock.mock.calls).toHaveLength(1)
        expect(fetchMock.mock.calls[0][0]).toEqual('http://test.com/validate?uid=123%404&response=this%20is%20a%20test')
    })
})
