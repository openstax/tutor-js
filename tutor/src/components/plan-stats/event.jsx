import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import Course from '../../models/course';
import TeacherTaskPlan from '../../models/task-plans/teacher/plan';
import { Markdown } from 'shared';

export default function Event({ plan, course }) {
  let description;
  const periodNames = map(course.periods.active, 'name').join(', ');
  if (plan.description) {
    description = <Markdown text={plan.description} block={true} />;
  }
  return (
    <div className="event-stats">
      <h3>
        For <strong>{periodNames}</strong>
      </h3>
      {description}
    </div>
  );
}

Event.propTypes = {
  plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
  course: PropTypes.instanceOf(Course).isRequired,
};
