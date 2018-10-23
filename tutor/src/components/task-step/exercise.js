import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

import { TaskStepActions, TaskStepStore } from '../../flux/task-step';
import { TaskProgressActions, TaskProgressStore } from '../../flux/task-progress';
import { TaskStore } from '../../flux/task';
import { TaskPanelStore } from '../../flux/task-panel';
import { StepPanel } from '../../helpers/policies';

import RelatedContentLink from '../related-content-link';
import { ChapterSectionMixin, CardBody, ExerciseWithScroll, ExControlButtons } from 'shared';

import StepFooter from './step-footer';

const canOnlyContinue = id =>
  _.chain(StepPanel.getRemainingActions(id))
    .difference(['clickContinue'])
    .isEmpty()
    .value()
;

const getWaitingText = function(id) {
  switch (false) {
  case !TaskStepStore.isSaving(id): return 'Saving…';
  case !TaskStepStore.isLoading(id): return 'Loading…';
  default: return null;
  }
};

const getReadingForStep = (id, taskId) => TaskStore.getReadingForTaskId(taskId, id);

const getCurrentPanel = id => StepPanel.getPanel(id);

export default createReactClass({
  displayName: 'ExerciseShell',

  propTypes: {
    id: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
  },

  mixins: [ ChapterSectionMixin ],

  contextTypes: {
    router: PropTypes.object,
  },

  getInitialState() {
    const partsInfo = this.getPartsInfo();
    const taskInfo = this.getTaskInfo();

    return _.extend({}, partsInfo, taskInfo);
  },

  getPartsInfo(props) {
    if (props == null) { ((((((({ props } = this))))))); }

    const { id, taskId, courseId, onNextStep } = props;
    let parts = TaskStore.getStepParts(taskId, id);

    parts = _.map(parts, function(part) {
      const stepIndex = TaskPanelStore.getStepIndex(taskId, { id: part.id });
      const questionNumber = TaskStore.getStepIndex(taskId, part.id) + 1;

      return _.extend({}, part, { stepIndex, questionNumber });
    });

    const lastPartId = _.last(parts).id;
    const isSinglePartExercise = this.isSinglePart(parts);

    return { parts, lastPartId, isSinglePartExercise };
  },

  getTaskInfo(props) {
    if (props == null) { ((((((({ props } = this))))))); }
    const { taskId } = props;

    const task = TaskStore.get(taskId);
    const currentStep = TaskProgressStore.get(taskId);

    return { task, currentStep };
  },

  isSinglePart(parts) {
    return parts.length === 1;
  },

  UNSAFE_componentWillMount() {
    return this.startListeningForProgress();
  },

  componentWillUnmount() {
    return this.stopListeningForProgress();
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.taskId !== this.props.taskId) {
      const nextState = _.extend({}, this.getTaskInfo(nextProps), this.getPartsInfo(nextProps));
      this.setState(nextState);
      this.stopListeningForProgress();
      return this.startListeningForProgress(nextProps);
    } else {
      return this.setState(this.getPartsInfo(nextProps));
    }
  },

  stopListeningForProgress(props) {
    if (props == null) { ((((((({ props } = this))))))); }
    const { taskId } = props;

    return TaskProgressStore.off(`update.${taskId}`, this.setCurrentStepFromProgress);
  },

  startListeningForProgress(props) {
    if (props == null) { ((((((({ props } = this))))))); }
    const { taskId } = props;

    return TaskProgressStore.on(`update.${taskId}`, this.setCurrentStepFromProgress);
  },

  canAllContinue() {
    const { parts } = this.state;

    return _.every(parts, part => canOnlyContinue(part.id));
  },

  allCorrect() {
    const { parts } = this.state;

    return _.every(parts, part => part.correct_answer_id === part.answer_id);
  },

  getReviewProps() {
    const { recoverFor } = this.props;
    const { task, lastPartId } = this.state;

    return {
      tryAnother: _.partial(recoverFor, lastPartId),
      canTryAnother: TaskStepStore.canTryAnother(lastPartId, task, !this.allCorrect()),
      isRecovering: TaskStepStore.isRecovering(lastPartId),
    };
  },

  setCurrentStepFromProgress({ current }) {
    return this.setCurrentStep(current);
  },

  setCurrentStep(currentStep) {
    if (currentStep === this.state.currentStep) { return; }

    this.setState({ currentStep });
    return this.props.goToStep(currentStep);
  },

  setCurrentStepByStepId(id) {
    const { taskId } = this.props;
    const stepNavIndex = TaskPanelStore.getStepIndex(taskId, { id });
    return this.setCurrentStep(stepNavIndex);
  },

  onFreeResponseChange(id, tempFreeResponse) {
    TaskStepActions.updateTempFreeResponse(id, tempFreeResponse);

    // set part to be active if part of multipart
    if (!this.isSinglePart(this.state.parts)) { return this.setCurrentStepByStepId(id); }
  },

  onChoiceChange(id, answerId) {
    TaskStepActions.setAnswerId(id, answerId);

    // set part to be active if part of multipart
    if (!this.isSinglePart(this.state.parts)) { return this.setCurrentStepByStepId(id); }
  },

  isAnyCompletedPartSaving() {
    const { parts } = this.state;

    return _.some(parts, part => part.is_completed && TaskStepStore.isSaving(part.id));
  },

  getFooterWaitingText() {
    if (this.isAnyCompletedPartSaving()) { return 'Saving…'; }
  },

  render() {
    let controlButtons, footer, setAnswerId, setFreeResponse;
    const { id, taskId, courseId, onNextStep, onStepCompleted, goToStep, pinned } = this.props;
    const { parts, lastPartId, isSinglePartExercise, task, currentStep } = this.state;
    const part = _.last(parts);

    if (TaskStore.isDeleted(taskId)) {
      setFreeResponse = _.noop;
      setAnswerId = _.noop;
    } else {
      setFreeResponse = TaskStepActions.setFreeResponseAnswer;
      setAnswerId = this.onChoiceChange;
    }

    if (this.canAllContinue() || !this.isSinglePart(parts)) {
      const reviewProps = this.getReviewProps();

      let canContinueControlProps = {
        panel: 'review',
        isContinueEnabled: this.canAllContinue(),
        onContinue: _.partial(onNextStep, { currentStep: part.stepIndex }),
      };

      canContinueControlProps = _.extend({}, canContinueControlProps, reviewProps);
      if (task.type === 'reading') { canContinueControlProps.controlText = 'Continue'; }

      controlButtons = <ExControlButtons
        {...canContinueControlProps}
        waitingText={this.getFooterWaitingText()}
        key="step-control-buttons" />;
    }

    if (!TaskStore.hasProgress(taskId)) {
      footer = <StepFooter
        id={id}
        key="step-footer"
        taskId={taskId}
        courseId={courseId}
        controlButtons={controlButtons} />;
    }

    return (
      <ExerciseWithScroll
        {...this.props}
        footer={footer}
        project="tutor"
        goToStep={_.partial(goToStep, _, true)}
        currentStep={currentStep}
        task={task}
        parts={parts}
        helpLink={React.createElement(RelatedContentLink, { 'courseId': (courseId), 'content': (part.related_content) })}
        onStepCompleted={onStepCompleted}
        controlButtons={controlButtons}
        canReview={StepPanel.canReview(part.id)}
        disabled={TaskStepStore.isSaving(part.id)}
        canOnlyContinue={canOnlyContinue}
        getWaitingText={getWaitingText}
        getCurrentPanel={getCurrentPanel}
        getReadingForStep={getReadingForStep}
        setFreeResponseAnswer={setFreeResponse}
        onFreeResponseChange={this.onFreeResponseChange}
        setAnswerId={setAnswerId} />
    );
  },
});
