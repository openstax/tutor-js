import PropTypes from 'prop-types';
import React, { createRef } from 'react';
import { computed, action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Overlay, Button, Popover } from 'react-bootstrap';
import { Icon } from 'shared';
import Course from '../../models/course';
import Push from '../../models/jobs/lms-score-push';

export default
@observer
class LmsPush extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @observable
  showPopover = false;

  constructor(props) {
    super(props);
    this.overlay = createRef();
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
    //if (!course.is_lms_enabled) { return null; }

    return (
      <>
        <Button
          ref={this.overlay}
          onClick={this.startPush}
          onMouseEnter={() => 
            this.showPopover = true
          }
          onMouseLeave={() => 
            this.showPopover = false
          }
          variant='plain'
          className={`${this.showPopover ? 'gradebook-btn-selected' : ''}`}>
          <Icon type="paper-plane" />
        </Button>
        <Overlay target={this.overlay.current} placement="bottom" show={this.showPopover}>
          <Popover className="gradebook-popover">
            <p>Export Course average to {course.name}</p>
          </Popover>
        </Overlay>
      </>
    );
  }

}
