import { R, C } from '../../helpers';
import PreviewOnlyWarning from '../../../src/components/onboarding/preview-only-warning';
import { PreviewOnboarding as CoursePreviewUX } from '../../../src/components/onboarding/ux'

// import FreshlyCreatedCourse from '../../../src/components/onboarding/ux'
// import  from '../../../src/models/course/onboarding/preview';

describe('Preview Only Warning', () => {

    let ux;

    beforeEach(() => {
        ux = new CoursePreviewUX({});
        Object.assign(ux, {
            hasViewedPublishWarning: jest.fn(),
        });
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(
            <C><PreviewOnlyWarning ux={ux} /></C>
        ).toMatchSnapshot();
    });

    it('dismisses on continue', async () => {
        const wrapper = mount(<R><PreviewOnlyWarning ux={ux} /></R>);
        wrapper.find('button.continue').simulate('click');
        expect(ux.hasViewedPublishWarning).toHaveBeenCalled();
        wrapper.unmount()
    });

    it('navigates on add', async () => {
        const wrapper = mount(<C><PreviewOnlyWarning ux={ux} /></C>);
        wrapper.find('button.create').simulate('click');
        expect(wrapper.instance().pathname).toEqual('/courses');
        wrapper.unmount()
    });

});
