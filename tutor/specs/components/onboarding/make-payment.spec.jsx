import { C, Factory } from '../../helpers';
import MakePayment from '../../../src/components/onboarding/make-payment';
import { StudentCourseOnboarding as Student } from '../../../src/components/onboarding/ux'
import { Payments } from '../../../src/helpers/payments'

describe('make payment modal', () => {
    let props;
    beforeEach(() => {
        Payments.config.js_url = 'test'; // silence warning about being unset
        props = {
            ux: new Student(Factory.course({ does_cost: true })),
            onDismiss: jest.fn(),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C><MakePayment {...props} /></C>).toMatchSnapshot();
    });

    it('calls onCancel', async () => {
        const wrapper = mount(<MakePayment {...props} />);
        // const onCancel = wrapper.ref('instance').props.onCancel;
        // expect(onCancel).toBe(ux.onPayLater);
        // expect(isFunction(onCancel)).toBe(true);
        wrapper.unmount()
    });
});
