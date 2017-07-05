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
          onComplete={this.onComplete}
          courseId={this.props.courseId}
        />
      );
    }
    return null;
  }

  render() {
    const { courseId } = this.props;

    if (!courseId || !Courses.get(courseId).needsPayment) { return null; }

    return (
      <Button bsStyle="primary" onClick={this.onClick} className="get-access visible-when-debugging">
        {this.renderModal()}
        Get access
      </Button>
    );
  }
}
