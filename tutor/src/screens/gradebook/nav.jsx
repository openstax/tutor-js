import PropTypes from 'prop-types';
import React from 'react';
import CoursePeriodsNav from '../../components/course-periods-nav';

const GradebookPeriodsTabs = ({ ux: { course, onSelectPeriod }, ...props }) => {
  if (!course.currentRole.isTeacher) {
    return null;
  }

  return (
    <CoursePeriodsNav
      course={course}
      handleSelect={onSelectPeriod}
      {...props}
    />
  );
};

GradebookPeriodsTabs.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default GradebookPeriodsTabs;
