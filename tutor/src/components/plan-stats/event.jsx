import React from 'react';
import { map } from 'lodash';
import { Panel } from 'react-bootstrap';
import TeacherTaskPlan from '../../models/task-plan/teacher';
import Courses from '../../models/courses-map';
import { Markdown } from 'shared';

export default function Event({ plan, courseId }) {
  let description;
  const periodNames = map(Courses.get(courseId).periods.active, 'name').join(', ');
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
  plan: React.PropTypes.instanceOf(TeacherTaskPlan).isRequired,
  courseId: React.PropTypes.string.isRequired,
};
