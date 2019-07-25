import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { get } from 'lodash';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import PaymentsModal from '../payments/modal';
import Payments from '../../models/payments';
import Course from '../../models/course';
import { Icon } from 'shared';

const FREE_TRIAL_MESSAGE = `
When the free trial ends, you'll be prompted to pay to maintain access
to your course. You will not lose any of the work you have completed
during the free trial.
`;

export default
@observer
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
    const student = get(this.props.course, 'userStudentRecord');
    if (!student) { return null; }

    // if the student is locked out then the pay now modal is already being displayed
    // if they're comped don't even mention payments
    if (student.mustPayImmediately || student.is_comped) { return null; }

    if (!Payments.config.is_enabled && this.props.course && this.props.course.isInTrialPeriod) {
      return (
        <span className="student-pay-now">
          Free trial <Icon type="info-circle" tooltip={FREE_TRIAL_MESSAGE} />
        </span>
      );
    }

    if (!this.props.course || !this.props.course.needsPayment) { return null; }

    return (
      <span className="student-pay-now">
        You have {this.props.course.userStudentRecord.trialTimeRemaining} left in your free trial
        {this.renderModal()}
        <Button variant="primary" onClick={this.onClick}>
          Pay now
        </Button>
      </span>
    );
  }
}
