jest.mock('axios', () => jest.fn( () => Promise.resolve()));

const axios = require('axios');

const Networking = require('model/networking');

describe('Stand-alone Networking', () =>

  it('extends itself with set options when calling', function() {
    Networking.setOptions({ xhr: { CSRF_Token: '1234' } });
    Networking.perform({
      method: 'PUT',
      url: '/test',
      withCredentials: true,
      data: { foo: 'bar' },
    });
    expect(axios).toHaveBeenCalledWith({
      'method': 'PUT',
      'url': '/test',
      'withCredentials': true,
      'CSRF_Token': '1234',
      'data': { 'foo': 'bar' },
    });
    return undefined;
  })
);
