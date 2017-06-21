import React from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Router from '../../helpers/router';

import { wrapCourseDropComponent } from './course-dnd';
import TutorLink from '../link';
import IconAdd from '../icons/add';
import Courses from '../../models/courses-map';

function AddCoursePopover(props) {
  return (

    <Popover id='add-course-popover'
      placement="right"
      title="Create a course anytime!"
    >
      <p>Click here to create a real course.</p>
    </Popover>

  );
}

@wrapCourseDropComponent @observer
export default class CreateACourse extends React.PureComponent {

  static propTypes = {
    isHovering: React.PropTypes.bool,
    connectDropTarget: React.PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  onDrop(course) {
    const url = Router.makePathname('createNewCourse', { sourceId: course.id });
    this.context.router.transitionTo(url);
  }

  renderAddZone() {
    return (
      this.props.connectDropTarget(
        <div className="my-courses-add-zone">
          <TutorLink
            to="createNewCourse"
            className={classnames({ 'is-hovering': this.props.isHovering })}>
            <div>
              <IconAdd />
              <span>
                CREATE A COURSE
              </span>
            </div>
          </TutorLink>
        </div>
      )
    );
  }

  render() {
    const addZone = this.renderAddZone();
    if (Courses.nonPreview.isEmpty) {
      return (
        <div className="my-courses-add-wrapper">
          {addZone}
          <AddCoursePopover />
        </div>
      );
    }
    return addZone;
  }
}
