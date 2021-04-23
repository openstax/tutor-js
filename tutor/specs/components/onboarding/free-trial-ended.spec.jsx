import { Factory, C, runInAction } from '../../helpers';
import FreeTrialEnded from '../../../src/components/onboarding/free-trial-ended';
import { StudentCourseOnboarding as Student } from '../../../src/components/onboarding/ux'

describe('Free trial ended modal', () => {
    let props;

    beforeEach(() => {
        props = {
            ux: new Student(Factory.course({ does_cost: true })),
            onDismiss: jest.fn(),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C><FreeTrialEnded {...props} /></C>).toMatchSnapshot();
    });

    it('does not ask for payments on old courses', () => {
        expect(props.ux.course.hasEnded).toBe(false);
        const modal = mount(<C><FreeTrialEnded {...props} /></C>);
        expect(modal.text()).toContain('Buy access');
        runInAction(() => {
            props.ux.course.ends_at = (new Date() - 10000);
        })
        expect(props.ux.course.hasEnded).toBe(true);
        expect(modal.text()).not.toContain('Buy access');
        modal.unmount();
    });
});
