import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import { TaskStepStore } from '../../flux/task-step';
import { TaskStore } from '../../flux/task';

import { Icon } from 'shared';
import { ChapterSectionMixin, CardBody, ExerciseGroup, ExControlButtons } from 'shared';

import StepFooter from './step-footer';

class Placeholder extends React.Component {
  static displayName = 'Placeholder';

  static propTypes = {
    id: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
  };

  onContinue = () => {
    return this.props.onNextStep();
  };

  render() {
    const { id, taskId, courseId } = this.props;
    const { type } = TaskStore.get(taskId);
    const step = TaskStepStore.get(id);
    const exists = TaskStepStore.shouldExist(id);
    const isLoading = TaskStepStore.isLoadingPersonalized(id);

    const message = exists ?
      isLoading ?
        'Your personalized question is loading. Please wait.'
        :
        `Unlock this personalized question by answering more ${type} problems for this assignment.`
      :
      'Looks like we don\'t have a personalized question this time. If you\'ve answered all the other questions, you\'re done!';

    const classes = classnames('task-step-personalized',
      { 'task-step-personalized-missing': !exists });

    const controlButtons = <ExControlButtons
      panel="review"
      controlText="Continue"
      onContinue={this.onContinue}
      isContinueEnabled={!exists} />;

    const footer = <StepFooter
      id={id}
      key="step-footer"
      taskId={taskId}
      courseId={courseId}
      controlButtons={controlButtons}
      onContinue={this.onContinue} />;

    const group = <ExerciseGroup
      key="step-exercise-group"
      project="tutor"
      group={step.group}
      related_content={step.related_content} />;

    return (
      <CardBody
        className="task-step openstax-exercise-card"
        pinned={true}
        footer={footer}>
        {group}
        <div className={classes}>
          {message}
        </div>
      </CardBody>
    );
  }
}

export default Placeholder;
