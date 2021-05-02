import { C, Factory } from '../../helpers';
import PayNowOrLater from '../../../src/components/onboarding/pay-now-or-later';
import { StudentCourseOnboarding as Student } from '../../../src/components/onboarding/ux'

describe('pay now or later modal', () => {
    let props;
    beforeEach(() => {
        props = {
            ux: new Student(Factory.course({ does_cost: true })),
            onDismiss: jest.fn(),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C><PayNowOrLater {...props} /></C>).toMatchSnapshot();
    });

});
