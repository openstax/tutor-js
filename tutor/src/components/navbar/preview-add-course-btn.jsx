import React from 'react';

import { NavItem, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';

import Courses from '../../models/courses-map.js';

@observer
export default class PreviewAddCourseBtn extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string,
  }

  render() {
    // const course = Courses.get(this.props.courseId);
    // if (!course.is_preview) { return null; }

    return (
      <Button>Create a course</Button>
    );
  }
}
