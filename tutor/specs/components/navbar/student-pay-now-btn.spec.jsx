import { Factory, TimeMock, runInAction } from '../../helpers';
import GetAccess from '../../../src/components/navbar/student-pay-now-btn';
import { FeatureFlagsApi } from '../../../src/models'
import UiSettings from 'shared/model/ui-settings'
import { PAY_LATER_CHOICE } from '../../../src/components/onboarding/ux/student-course'

jest.mock('../../../src/models/course');

describe('Student get access button', function() {
    let props;

    TimeMock.setTo('2017-07-01');

    beforeEach(() => {
        props = {
            course: Factory.course(),
        };
        props.course.userStudentRecord = {};
    });

    it('does not render if course if free', () => {
        props.course.does_cost = false;
        const btn = shallow(<GetAccess {...props} />);
        expect(btn.html()).toBeNull();
    });

    it('does not render if student is comped', () => {
        props.course.userStudentRecord.is_comped = true;
        const btn = shallow(<GetAccess {...props} />);
        expect(btn.html()).toBeNull();
    });

    it('renders trial message when payments is disabled', () => {
        runInAction(() => FeatureFlagsApi.set('is_payments_enabled', false))
        props.course.isInTrialPeriod = true;
        const btn = shallow(<GetAccess {...props} />);
        expect(btn.text()).toContain('Free trial');
    });

    it('changes settings to get the payment screen to show', () => {
        props.course.needsPayment = true;
        props.course.userStudentRecord = { trialTimeRemaining: '1 day', markPaid: jest.fn() };
        const btn = mount(<GetAccess {...props} />);
        btn.find('Button').simulate('click');
        expect(UiSettings.get(PAY_LATER_CHOICE)).toBe('NOW')
    });

});
