import React from 'react';
import BS from 'react-bootstrap';
import _ from 'underscore';

import { TaskStore } from '../../flux/task';
import { CardBody, PinnableFooter, ChapterSectionMixin } from 'shared';
import Review from '../task/review';

class ConceptCoachEnd extends React.Component {
  static displayName = 'TaskEnd';

  isDone = () => {
    const { taskId } = this.props;
    const incompleteSteps = TaskStore.getIncompleteSteps(taskId);
    return _.isEmpty(incompleteSteps);
  };

  renderReviewSteps = (taskId, steps, type = 'completed') => {
    let stepsReview;
    const { courseId } = this.props;

    return stepsReview =
      <div className={`task task-review-${type}`}>
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
    const { footer, taskId } = this.props;
    const completedSteps = TaskStore.getCompletedSteps(taskId);
    const completedReview = this.renderReviewSteps(taskId, completedSteps);

    return (
      <div className="task-review -concept-coach-completed">
        {completedReview}
        <PinnableFooter>
          {footer}
        </PinnableFooter>
      </div>
    );
  }
}

export { ConceptCoachEnd };
