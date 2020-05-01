import PropTypes from 'prop-types';
import React from 'react';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon } from 'shared';
import Course from '../../models/course';
import Push from '../../models/jobs/lms-score-push';

export default
@observer
class LmsPush extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
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
    const { lastPushedAt } = this.lmsPush;
    if (lastPushedAt) {
      return <span>Last sent to LMS: {lastPushedAt}</span>;
    }
    return <span>Send individual course averages to LMS</span>;
  }

  render() {
    const { course } = this.props;
    
    if (!course.is_lms_enabled) { return null; }
    
    const popover = (
      <Popover className="gradebook-popover">
        <p>Export Course average to {course.name}</p>
      </Popover>
    );
    return (
      <>
        <OverlayTrigger placement="bottom" overlay={popover} trigger="hover">
          <Button
            onClick={this.startPush}
            variant='plain'
          >
            <Icon type="paper-plane" />
          </Button>
        </OverlayTrigger>
        
      </>
    );
  }

}
