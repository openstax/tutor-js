import React from 'react';

import { observer } from 'mobx-react';
import classnames from 'classnames';
import Router from '../../helpers/router';

import { wrapCourseDropComponent } from './course-dnd';
import TutorLink from '../link';
import IconAdd from '../icons/add';

@wrapCourseDropComponent @observer
export default class AddCourseArea extends React.PureComponent {

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

  render() {
    return (
      this.props.connectDropTarget(
        <div className="my-courses-add-zone">
          <TutorLink
            to="createNewCourse"
            className={classnames({ 'is-hovering': this.props.isHovering })}>
            <div>
              <IconAdd />
              <span>
                Add a course
              </span>
            </div>
          </TutorLink>
        </div>
      )
    );
  }
}
