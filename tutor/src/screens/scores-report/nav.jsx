import PropTypes from 'prop-types';
import React from 'react';
import CoursePeriodsNav from '../../components/course-periods-nav';
import Course from '../../models/course';
import { keys, pick } from 'lodash';

const COURSE_PERIODS_NAV_PROPS = keys(CoursePeriodsNav.propTypes);

const ScoresReportNav = (props) => {
  if (!props.course.currentRole.isTeacher) {
    return null;
  }

  return (
    <CoursePeriodsNav
      {...pick(props, COURSE_PERIODS_NAV_PROPS)}
      courseId={props.course.id}
    />
  );
};

ScoresReportNav.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
};

export default ScoresReportNav;
