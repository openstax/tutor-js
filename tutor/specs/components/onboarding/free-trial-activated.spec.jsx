import { C, Factory } from '../../helpers';
import FreeTrialActivated from '../../../src/components/onboarding/free-trial-activated';
import { StudentCourseOnboarding as Student } from '../../../src/components/onboarding/ux'

describe('Free trial ended modal', () => {
    let ux;
    beforeEach(() => {
        ux = new Student(Factory.course({ does_cost: true }))
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(
            <C>
                <FreeTrialActivated
                    onDismiss={jest.fn()}
                    ux={ux} />
            </C>
        ).toMatchSnapshot();
    });

});
