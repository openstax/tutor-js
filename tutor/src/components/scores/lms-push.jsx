import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import TourAnchor from '../tours/anchor';
import Icon from '../icon';
import Course from '../../models/course';
import Push from '../../models/jobs/lms-score-push';
import LoadingScreen from '../loading-screen';

@observer
export default class LmsPush extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  @computed get lmsPush() {
    return Push.forCourse(this.props.course);
  }

  @action.bound startPush() {
    this.lmsPush.start();
  }

  @computed get message() {
    if (this.lmsPush.isPending) {
      return <span className="busy">Sending course averages to LMS…</span>;
    }
    return <span>Last sent to LMS: {this.lmsPush.lastPushedAt}</span>;
  }

  render() {
    const { lmsPush, props: { course } } = this;
    if (!course.is_lms_enabled) { return null; }

    return (
      <TourAnchor className="scores-push" id="scores-export-button">
        <Button
          onClick={this.startPush}
        >
          <Icon type="paper-plane" />
        </Button>
        {this.message}
      </TourAnchor>
    );
  }

}
