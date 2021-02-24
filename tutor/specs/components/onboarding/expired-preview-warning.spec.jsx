import { C } from '../../helpers';
import ExpiredPreviewWarning from '../../../src/components/onboarding/expired-preview-warning';
import CoursePreviewUX from '../../../src/models/course/onboarding/preview';

describe('Expired Preview Warning', () => {

    let ux;
    beforeEach(() => {
        ux = new CoursePreviewUX({});
        ux.dismissNag = jest.fn();
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(
            <C><ExpiredPreviewWarning ux={ux} /></C>
        ).toMatchSnapshot();
    });

    it('dislays got it and dismisses on continue', async () => {
        const wrapper = mount(<C path="/preview"><ExpiredPreviewWarning ux={ux} /></C>);
        expect(wrapper.instance().pathname).toEqual('/preview');
        expect(await axe(wrapper.html())).toHaveNoViolations();

        wrapper.find('Button[variant="default"]').simulate('click');
        expect(wrapper.find('Body').render().text()).toContain('ready to create a real course');

        wrapper.find('Button[variant="primary"]').simulate('click');
        expect(ux.dismissNag).toHaveBeenCalled();
        expect(wrapper.instance().router.history.location.pathname).toEqual('/preview');
    });

    it('navigates on add', async () => {
        const wrapper = mount(<C><ExpiredPreviewWarning ux={ux} /></C>);
        expect(await axe(wrapper.html())).toHaveNoViolations();
        wrapper.find('Button[variant="primary"]').simulate('click');

        expect(wrapper.instance().pathname).toEqual('/dashboard');

    });

});
