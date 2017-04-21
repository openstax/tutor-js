import React from 'react';

import Course from '../../models/course';

import TutorLink from '../link';

export default class CourseName extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course),
  }

  render() {
    const { course } = this.props;
    if (!course) { return null; }

    return (
      <TutorLink to="dashboard" params={{ courseId: course.id }} className="course-name">
        {course.name}
      </TutorLink>
    );
  }
}
