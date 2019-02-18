import { ResponseValidation } from '../../src/models/response_validation';

describe(ResponseValidation, () => {
  it('does not request info when not configured', () => {
    const rv = new ResponseValidation();
    expect(rv.validate({ response: 'test' })).toEqual('ABORT');
  });
});
