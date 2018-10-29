import _ from 'underscore';
import PropTypes from 'prop-types';
import React from 'react';
import { Breadcrumb } from 'shared';

import { StepCard } from '../../helpers/policies';

import { TaskStepActions, TaskStepStore } from '../../flux/task-step';
import { TaskStore } from '../../flux/task';

class BreadcrumbStatic extends React.Component {
  static displayName = 'BreadcrumbStatic';

  static propTypes = {
    crumb: PropTypes.shape({
      // data: React.PropTypes.shape(
      //   id: React.PropTypes.string.isRequired
      //   task_id: React.PropTypes.string.isRequired
      // ).isRequired
      type: PropTypes.string.isRequired,
    }).isRequired,
  };

  setStep = (props) => {
    const { crumb } = props;
    return this.setState({ step: crumb });
  };

  UNSAFE_componentWillMount() {
    return this.setStep(this.props);
  }

  render() {
    let { step } = this.state;
    const crumbProps = _.omit(this.props, 'step');
    if (_.isArray(step)) { step = _.first(step); }

    return <Breadcrumb {...crumbProps} step={step} />;
  }
}

class BreadcrumbTaskDynamic extends React.Component {
  static displayName = 'BreadcrumbTaskDynamic';

  static propTypes = {
    crumb: PropTypes.shape({
      // data: React.PropTypes.shape(
      //   id: React.PropTypes.number.isRequired
      //   task_id: React.PropTypes.number.isRequired
      // ).isRequired
      type: PropTypes.string.isRequired,
    }).isRequired,

    onMount: PropTypes.func,
  };

  componentDidMount() {
    return (typeof this.props.onMount === 'function' ? this.props.onMount() : undefined);
  }

  componentWillUnmount() {
    TaskStore.off('step.completed', this.update);
    TaskStore.off('step.completing', this.update);
    return TaskStepStore.off('step.loaded', this.update);
  }

  setStep = (props) => {
    let canReview;
    const { crumb } = props;

    let step = crumb;
    if (crumb.id != null) {
      // get the freshest version of the step
      step = TaskStepStore.get(crumb.id);
    }

    if ((crumb.id != null) && (step != null)) { canReview = StepCard.canReview(step.id); }

    return this.setState({ step, canReview });
  };

  UNSAFE_componentWillMount() {
    const { crumb } = this.props;
    this.setStep(this.props);
    TaskStore.on('step.completed', this.update);
    TaskStore.on('step.completing', this.update);
    if (TaskStepStore.isPlaceholder(crumb.id)) {
      return TaskStepStore.on('step.loaded', this.update);
    }
  }

  checkPlaceholder = () => {
    const { crumb } = this.props;
    const stepId = crumb.id;
    const taskId = crumb.task.id;

    if (!TaskStore.hasIncompleteCoreStepsIndexes(taskId) &&
      !TaskStepStore.isLoadingPersonalized(stepId)) {
      return TaskStepActions.loadPersonalized(stepId);
    }
  };

  update = (id) => {
    const { crumb } = this.props;
    if (TaskStepStore.isPlaceholder(crumb.id)) { this.checkPlaceholder(); }

    if (crumb.id === id) {
      return this.setStep(this.props);
    }
  };

  render() {
    const { step } = this.state;
    const crumbProps = _.omit(this.props, 'step', 'onMount');

    return <Breadcrumb {...crumbProps} step={step} />;
  }
}

export { BreadcrumbTaskDynamic, BreadcrumbStatic };
