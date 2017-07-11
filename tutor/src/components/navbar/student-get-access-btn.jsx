import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import PaymentsModal from '../payments/modal';
import User from '../../models/user';
import Courses from '../../models/courses-map';

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
    if (!this.course || !this.course.needsPayment) { return null; }

    return (
      <Button bsStyle="primary" onClick={this.onClick} className="get-access">
        {this.renderModal()}
        Get access
      </Button>
    );
  }
}
