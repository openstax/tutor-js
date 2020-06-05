import { React, PropTypes } from 'vendor';
import { CenteredBackButton } from '../back-button';
import UX from '../ux';
import Link from '../../../components/link';
import { StepCard } from './card';


const Card = ({ children, ux: { course } }) => (
  <StepCard className="task-steps-end">
    {children}
    <CenteredBackButton
      fallbackLink={{
        text: 'Back to dashboard', to: 'dashboard', params: { courseId: course.id },
      }} />
  </StepCard>
);
Card.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
  children: PropTypes.node.isRequired,
};

const TaskEndMessage = ({ ux, ux: { course, task } }) => {
  if (!task.progress.complete) {
    return (
      <Card ux={ux}>
        <h1>No steps have been completed.</h1>
        <h4>
          <Link
            to="viewTask"
            params={{ courseId: course.id, id: task.id }}
          >
            Begin work on assignment
          </Link>
        </h4>
      </Card>
    );
  }

  if (!task.progress.incomplete) {
    return (
      <Card ux={ux}>
        <h1>You are done.</h1>
        <h3>
          Great job {task.isReading ?
            'completing all the steps' : 'answering all the questions'}.
        </h3>
      </Card>
    );
  }

  return (
    <Card ux={ux}>
      <h1>Assignment is partially complete.</h1>
      <h3>
        You've completed {task.progress.complete} of {task.steps.length} steps.
      </h3>
    </Card>
  );

};

TaskEndMessage.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default TaskEndMessage;
