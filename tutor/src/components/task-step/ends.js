import PropTypes from 'prop-types';
import React from 'react';
import TutorLink from '../link';
import BackButton from '../buttons/back-button';
import { CoursePracticeStore } from '../../flux/practice';
import { TaskStore } from '../../flux/task';
import { CardBody, PinnableFooter } from 'shared';
import Review from '../task/review';
import { ConceptCoachEnd } from './concept-coach-end';

// A function to render the status message.
// Shared between the various ending components
const renderStatusMessage = function(completeSteps, totalSteps) {
  if (completeSteps === totalSteps) {
    return (
      <span>
        <h1>
          You are done.
        </h1>
        <h3>
          Great job answering all the questions.
        </h3>
      </span>
    );
  } else {
    return (
      <h3>
        {'You have answered '}
        {completeSteps}
        {' of '}
        {totalSteps}
        {' questions.'}
      </h3>
    );
  }
};

class PracticeEnd extends React.Component {
  static displayName = 'PracticeEnd';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
    reloadPractice: PropTypes.func.isRequired,
  };

  render() {
    const { courseId, taskId, reloadPractice } = this.props;
    const { type } = TaskStore.get(taskId);

    const pageIds = CoursePracticeStore.getCurrentTopics(courseId, taskId);

    const fallbackLink = {
      to: 'viewPerformanceGuide',
      params: { courseId },
      text: 'Back to Performance Forecast',
    };

    // custom footer for practices
    const footer =
      <div className={`-${type}-end`}>
        <BackButton fallbackLink={fallbackLink} />
      </div>;

    const completeSteps = TaskStore.getCompletedStepsCount(taskId);
    const totalSteps = TaskStore.getTotalStepsCount(taskId);
    return (
      <div className="task task-completed">
        <CardBody footer={footer} className={`-${type}-completed`}>
          <div className="completed-message">
            {renderStatusMessage(completeSteps, totalSteps)}
          </div>
        </CardBody>
      </div>
    );
  }
}

class HomeworkEnd extends React.Component {
  static defaultProps = { windowImpl: window };
  static displayName = 'HomeworkEnd';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
    windowImpl: PropTypes.object,
  };

  state = { scrollPos: 0 };

  componentDidUpdate() {
    return this.props.windowImpl.scroll(0, this.state.scrollPos);
  }

  onNextStep = () => {
    const scrollPos = this.props.windowImpl.scrollY;
    return this.setState({ scrollPos });
  };

  goToStep = () => {};

  renderAfterDue = (taskId) => {
    const { footer, courseId } = this.props;

    const completedSteps = TaskStore.getCompletedSteps(taskId);
    const incompleteSteps = TaskStore.getIncompleteSteps(taskId);
    const totalStepsCount = TaskStore.getTotalStepsCount(taskId);
    let completedLabel = null;
    let todoLabel = null;

    if (completedSteps.length) {
      completedLabel = <h1>
        Problems Review
      </h1>;
    }

    if (incompleteSteps.length) {
      todoLabel =
        <h1>
          {'Problems To Do '}
          <small>
            {incompleteSteps.length}
            {' remaining'}
          </small>
        </h1>;
    }

    const completedReview = this.renderReviewSteps(taskId, completedSteps, completedLabel, 'completed');
    const todoReview = this.renderReviewSteps(taskId, incompleteSteps, todoLabel, 'todo');

    return (
      <div className="task-review -homework-completed">
        <CardBody>
          <div className="completed-message">
            <div className="task-status-message">
              {renderStatusMessage(completedSteps.length, totalStepsCount)}
            </div>
          </div>
        </CardBody>
        {todoReview}
        {completedReview}
        <PinnableFooter>
          {footer}
        </PinnableFooter>
      </div>
    );
  };

  renderBeforeDue = (taskId) => {
    let feedback;
    const { footer, courseId } = this.props;
    const completedStepsCount = TaskStore.getCompletedStepsCount(taskId);
    const totalStepsCount = TaskStore.getTotalStepsCount(taskId);

    if (!TaskStore.isFeedbackImmediate(taskId)) {
      feedback = <ul>
        <li>
          You can still review and update your answers until the due date.
        </li>
        <li>
          Your homework will be automatically turned in on the due date.
        </li>
      </ul>;
    }

    return (
      <div className="task task-completed">
        <CardBody footer={footer} className="-homework-completed">
          <div className="completed-message">
            {renderStatusMessage(completedStepsCount, totalStepsCount)}
            {feedback}
            <p className="link-to-forecast">
              <TutorLink to="viewPerformanceGuide" params={{ courseId }}>
                {'\
    View your Performance Forecast\
    '}
              </TutorLink>
              {' to see your progress in the course and get more practice.\
    '}
            </p>
          </div>
        </CardBody>
      </div>
    );
  };

  renderReviewSteps = (taskId, steps, label, type) => {
    let stepsReview;
    const { courseId } = this.props;

    return stepsReview =
      <div className={`task task-review-${type}`}>
        {label}
        <Review
          steps={steps}
          taskId={taskId}
          courseId={courseId}
          goToStep={this.goToStep}
          onNextStep={this.onNextStep}
          review={type}
          key={`task-review-${type}`}
          focus={type === 'todo'} />
      </div>;
  };

  render() {
    const { taskId } = this.props;
    const isTaskPastDue = TaskStore.isTaskPastDue(taskId);

    if (isTaskPastDue) {
      return this.renderAfterDue(taskId);
    } else {
      return this.renderBeforeDue(taskId);
    }
  }
}

class TaskEnd extends React.Component {
  static displayName = 'TaskEnd';

  render() {
    const { courseId } = this.props;
    return (
      <div className="task task-completed">
        <CardBody className="-reading-completed">
          <div className="completed-message">
            <h1>
              You are done.
            </h1>
            <h3>
              Great job completing all the steps.
            </h3>
            <TutorLink
              to="dashboard"
              key="step-end-back"
              params={{ courseId }}
              className="btn btn-primary">
              {'\
    Back to Dashboard\
    '}
            </TutorLink>
          </div>
        </CardBody>
      </div>
    );
  }
}

const ends = {
  task: TaskEnd,
  concept_coach: ConceptCoachEnd,
  homework: HomeworkEnd,
  practice: PracticeEnd,
  chapter_practice: PracticeEnd,
  page_practice: PracticeEnd,
  practice_worst_topics: PracticeEnd,
  reading: TaskEnd,
};

export default {
  get(type) {
    return ends[type] || TaskEnd;
  },
};
