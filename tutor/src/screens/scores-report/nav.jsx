import React from 'react';
import CoursePeriodsNav from '../../components/course-periods-nav';
import Course from '../../models/course';

import { keys, pick } from 'lodash';

const COURSE_PERIODS_NAV_PROPS = keys(CoursePeriodsNav.propTypes);

export default class ScoresReportNav extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    if (!this.props.course.isTeacher) {
      return null;
    }

    return (
      <CoursePeriodsNav
        {...pick(this.props, COURSE_PERIODS_NAV_PROPS)}
        courseId={this.props.course.id}
      />
    );
  }
}
