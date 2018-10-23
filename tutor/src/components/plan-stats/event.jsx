import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import { Panel } from 'react-bootstrap';
import Course from '../../models/course';
import TeacherTaskPlan from '../../models/task-plan/teacher';
import { Markdown } from 'shared';

export default function Event({ plan, course }) {
  let description;
  const periodNames = map(course.periods.active, 'name').join(', ');
  if (plan.description) {
    description = <Markdown text={plan.description} block={true} />;
  }
  return (
    <Panel className="event-stats">
      <h3>
        For <strong>{periodNames}</strong>
      </h3>
      {description}
    </Panel>
  );
}

Event.propTypes = {
  plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
  course: PropTypes.instanceOf(Course).isRequired,
};
