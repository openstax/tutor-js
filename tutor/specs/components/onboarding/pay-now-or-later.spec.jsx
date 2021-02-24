import { C } from '../../helpers';
import PayNowOrLater from '../../../src/components/onboarding/pay-now-or-later';
import { STUDENT_COURSE_ONE_MODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';

describe('pay now or later modal', () => {
    let props;
    beforeEach(() => {
        props = {
            ux: new Student(new Course(STUDENT_COURSE_ONE_MODEL)),
            onDismiss: jest.fn(),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C><PayNowOrLater {...props} /></C>).toMatchSnapshot();
    });

});
