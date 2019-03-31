import ResponseValidation from '../../src/models/response_validation';

describe(ResponseValidation, () => {
  it('does not request info when not configured', () => {
    let rv = new ResponseValidation();
    expect(rv.validate({ response: 'test' })).toEqual('ABORT');

    rv = new ResponseValidation();
    rv.config.url = 'http://test.com';
    rv.config.is_enabled = false;
    expect(rv.validate({ response: 'test' })).toEqual('ABORT');
  });
});
