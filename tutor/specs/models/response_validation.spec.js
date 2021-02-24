import ResponseValidation from '../../src/models/response_validation';

describe(ResponseValidation, () => {
    let rv;

    beforeEach(() => {
        rv = new ResponseValidation();
        rv.config.url = 'http://test.com';
        rv.config.is_enabled = true;
    });

    it('does not request info when not configured', () => {
        rv.config.url = '';
        expect(rv.validate({ response: 'test' })).toEqual('ABORT');

        rv = new ResponseValidation();
        rv.config.url = 'http://test.com';
        rv.config.is_enabled = false;
        expect(rv.validate({ response: 'test' })).toEqual('ABORT');
    });
    it('makes request', () => {
        expect(
            rv.validate({ response: 'this is a test', uid: '123@4' }),
        ).toEqual({
            url: rv.config.url ,
            query: { uid: '123@4', response: 'this is a test' },
        });
    });

});
