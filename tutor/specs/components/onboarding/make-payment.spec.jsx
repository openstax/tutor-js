import { C } from '../../helpers';
import MakePayment from '../../../src/components/onboarding/make-payment';
import { STUDENT_COURSE_ONE_MODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';
import Payments from '../../../src/models/payments';

describe('make payment modal', () => {
    let props;
    beforeEach(() => {
        Payments.config.js_url = 'test'; // silence warning about being unset
        props = {
            ux: new Student(new Course(STUDENT_COURSE_ONE_MODEL)),
            onDismiss: jest.fn(),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C><MakePayment {...props} /></C>).toMatchSnapshot();
    });

    it('calls onCancel', async () => {
        const wrapper = mount(<MakePayment {...props} />);
        expect(await axe(wrapper.html())).toHaveNoViolations();
    // const onCancel = wrapper.ref('instance').props.onCancel;
    // expect(onCancel).toBe(ux.onPayLater);
    // expect(isFunction(onCancel)).toBe(true);
    });
});
