import { React, PropTypes, action, observable, observer } from 'vendor';
import { Button } from 'react-bootstrap';
import PaymentsModal from '../payments/modal';
import { FeatureFlags, Course } from '../../models'
import { Icon } from 'shared';

const FREE_TRIAL_MESSAGE = `
When the free trial ends, you'll be prompted to pay to maintain access
to your course. You will not lose any of the work you have completed
during the free trial.
`;
const isInTrialPeriod = (course) => {
    return Boolean(course && !FeatureFlags.is_payments_enabled && course.isInTrialPeriod);
};

const willDisplayPayment = (course) => {
    if (isInTrialPeriod(course)) { return true; }

    if (!course || !course.needsPayment) { return false; }
    const student = course.userStudentRecord;
    if (!student) { return false; }
    // if the student is locked out then the pay now modal is already being displayed
    // if they're comped don't even mention payments here
    if (student.mustPayImmediately || student.is_comped) { return false; }

    return true;
};


@observer
export default
class StudentPayNowBtn extends React.Component {

    static propTypes = {
        course: PropTypes.instanceOf(Course),
    }

    @observable isShowingModal = false;

    @action.bound
    onClick() {
        this.isShowingModal = true;
    }

    @action.bound
    onComplete() {
        this.props.course.userStudentRecord.markPaid();
        this.isShowingModal = false;
    }

    @action.bound
    onCancel() {
        this.isShowingModal = false;
    }

    renderModal() {
        if (this.isShowingModal) {
            return (
                <PaymentsModal
                    onPaymentComplete={this.onComplete}
                    onCancel={this.onCancel}
                    course={this.props.course}
                />
            );
        }
        return null;
    }

    render() {
        if (!willDisplayPayment(this.props.course)) { return null; }

        if (isInTrialPeriod(this.props.course)) {
            return (
                <span className="student-pay-now">
          Free trial <Icon type="info-circle" tooltip={FREE_TRIAL_MESSAGE} />
                </span>
            );
        }

        return (
            <span className="student-pay-now">
                <span className="days">
          You have {this.props.course.userStudentRecord.trialTimeRemaining} left in your free trial
                </span>
                {this.renderModal()}
                <Button variant="primary" onClick={this.onClick}>
          Pay now
                </Button>
            </span>
        );
    }
}

export { willDisplayPayment, StudentPayNowBtn };
