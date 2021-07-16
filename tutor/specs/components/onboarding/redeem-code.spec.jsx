import { C } from '../../helpers';
import RedeemCode from '../../../src/components/onboarding/redeem-code';
import { StudentCourseOnboarding as CourseUX } from '../../../src/components/onboarding/ux/student-course'

describe('Redeem Code', () => {

    let ux;

    beforeEach(() => {
        ux = new CourseUX({});
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(
            <C><RedeemCode ux={ux} /></C>
        ).toMatchSnapshot();
    });
});
