import Networking from 'shared/model/networking';
import { FetchMock } from 'jest-fetch-mock';
const fetchMock = fetch as FetchMock;

describe('Stand-alone Networking', () => {

    it('extends itself with set options when calling', function() {
        Networking.setOptions({ xhr: { CSRF_Token: '1234' } });
        Networking.perform({
            method: 'PUT',
            url: '/test',
            withCredentials: true,
            data: { foo: 'bar' },
        });
        expect(fetchMock.mock.calls.length).toEqual(1)
        expect(fetchMock.mock.calls[0][0]).toEqual('/test')
        expect(fetchMock.mock.calls[0][1]).toEqual({ method: 'PUT', data: JSON.stringify({ 'foo': 'bar' }) })
    });

});
