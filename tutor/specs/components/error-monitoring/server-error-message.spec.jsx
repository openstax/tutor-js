import ErrorMessage from '../../../src/components/error-monitoring/server-error-message';


describe('Error monitoring: server-error message', function() {
    let props = {};
    beforeEach(() =>
        props = {
            status: 404,
            statusMessage: 'Not Found',
            config: {
                method: 'none',
                url: 'non-url',
                data: 'code: Red',
            },
        }
    );

    it('renders for errors with status 500', function() {
        props.status = 500;
        const wrapper = shallow(<ErrorMessage {...props} />);
        expect(wrapper.text()).toContain('500');
    });

    it('shows interrupted message', function() {
        props.status = undefined;
        const wrapper = shallow(<ErrorMessage {...props} />);
        expect(wrapper.text()).toContain('It looks like your internet connection was interrupted');
    });

});
