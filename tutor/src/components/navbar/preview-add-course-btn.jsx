import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import { get } from 'lodash';

import TourAnchor from '../tours/anchor';

import Router from '../../helpers/router';
import Courses from '../../models/courses-map.js';
import createUXForCourse from '../../models/course/ux';

@observer
export default class PreviewAddCourseBtn extends React.PureComponent {
  static contextTypes = {
    router: React.PropTypes.object,
  }

  static propTypes = {
    courseId: React.PropTypes.string,
  }

  @computed get course() {
    return this.props.courseId ? Courses.get(this.props.courseId) : null;
  }

  @computed get ux() {
    return this.course ? createUXForCourse(this.course) : null;
  }

  @action.bound
  onAddCourse() {
    this.context.router.transitionTo(
      Router.makePathname('myCourses')
    );
  }

  render() {
    if (!get(this, 'ux.showCreateCourseAction')) { return null; }

    return (
      <TourAnchor id="preview-add-course-nav-button">
        <Button bsStyle="primary" onClick={this.onAddCourse}>Create a course</Button>
      </TourAnchor>
    );
  }
}
