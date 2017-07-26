import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import PaymentsModal from '../payments/modal';
import Payments from '../../models/payments';
import Courses from '../../models/courses-map';
import Icon from '../icon';

const FREE_TRIAL_MESSAGE = `
When the free trial ends, you'll be prompted to pay to maintain access
to your course. You will not lose any of the work you have completed
during the free trial.
`;

@observer
export default class StudentGetAccessBtn extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string,
  }

  @observable isShowingModal = false;
  @computed get course() {
    return this.props.courseId ? Courses.get(this.props.courseId) : null;
  }

  @action.bound
  onClick() {
    this.isShowingModal = true;
  }

  @action.bound
  onComplete() {
    this.isShowingModal = false;
  }

  renderModal() {
    if (this.isShowingModal) {
      return (
        <PaymentsModal
          onPaymentComplete={this.onComplete}
          onCancel={this.onComplete}
          course={this.course}
        />
      );
    }
    return null;
  }

  render() {
    if (!Payments.config.is_enabled && this.course && this.course.isInTrialPeriod) {
      return (
        <span className="student-get-access">
          Free trial <Icon type="info-circle" tooltip={FREE_TRIAL_MESSAGE} />
        </span>
      );
    }

    if (!this.course || !this.course.needsPayment) { return null; }

    return (
      <span className="student-get-access">
        You have {this.course.userStudentRecord.trialDaysRemaining} days left in your free trial
        {this.renderModal()}
        <Button bsStyle="primary" onClick={this.onClick}>
          Get access
        </Button>
      </span>
    );
  }
}
