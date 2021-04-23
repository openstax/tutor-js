import { C } from '../../helpers';
import SecondSessionWarning from '../../../src/components/onboarding/second-session-warning';
import { PreviewOnboarding as CoursePreviewUX } from '../../../src/components/onboarding/ux'
import { currentUser } from '../../../src/models';

jest.mock('../../../src/models/user', () => ({
    currentUser: {
        logEvent: jest.fn(),
    },
}));

describe('Second Session Warning', () => {

    let ux;
    beforeEach(() => {
        ux = new CoursePreviewUX({});
        ux.dismissNag = jest.fn();
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(
            <C><SecondSessionWarning ux={ux} /></C>
        ).toMatchSnapshot();
    });

    it('dislays got it and dismisses on continue', async () => {
        const wrapper = mount(<C><SecondSessionWarning ux={ux} /></C>);
        expect(await axe(wrapper.html())).toHaveNoViolations();
        wrapper.find('button.create').simulate('click');
        expect(currentUser.logEvent).toHaveBeenCalledWith({ category: 'onboarding', code: 'like_preview_yes' });
        expect(wrapper.find('Body').render().text()).toContain('Ready to create your real course');
    });

    it('navigates and logs on add', async () => {
        const wrapper = mount(<C><SecondSessionWarning ux={ux} /></C>);
        expect(await axe(wrapper.html())).toHaveNoViolations();
        wrapper.find('button.create').simulate('click');
        expect(currentUser.logEvent).toHaveBeenCalledWith({ category: 'onboarding', code: 'like_preview_yes' });
        expect(wrapper.instance().pathname).toEqual('/courses');
    });

});
