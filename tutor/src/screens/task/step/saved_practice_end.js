import { React, PropTypes } from 'vendor';
import { CenteredBackButton } from '../back-button';
import UX from '../ux';
import Link from '../../../components/link';
import { StepCard } from './card';

const getLatestUnWorkedIndex = (task) => {
  const unworkedStepIndex = task.steps.findIndex(s => !s.is_completed);
  return unworkedStepIndex > 0 ? task.steps[unworkedStepIndex].id : 'instructions';
};

const Card = ({ children }) => (
  <StepCard className="task-steps-end">
    {children}
  </StepCard>
);
Card.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
  children: PropTypes.node.isRequired,
};

const SavedPracticeEndMessage = ({ ux: { course, task } }) => {
  if (!task.progress.complete) {
    return (
      <Card>
        <h1>No steps have been completed.</h1>
        <Link
          to="viewTask"
          params={{ courseId: course.id, id: task.id }}
        >
            Begin work on assignment
        </Link>
      </Card>
    );
  }

  if (!task.progress.incomplete) {
    return (
      <Card>
        <h1>You are done.</h1>
        <h3>
          Great job answering all the questions.
        </h3>
        <CenteredBackButton
          fallbackLink={{
            text: 'Back to My Practice Questions',
            to: 'practiceQuestions',
            params: { courseId: course.id },
          }} />
      </Card>
    );
  }

  return (
    <Card>
      <h1>You've completed {task.progress.complete} of {task.steps.length} steps.</h1>
      <Link
        to="viewTask"
        params={{ courseId: course.id, id: task.id, stepId: getLatestUnWorkedIndex(task) }}
      >
            Continue working on practice assignment
      </Link>
    </Card>
  );

};
SavedPracticeEndMessage.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default SavedPracticeEndMessage;
