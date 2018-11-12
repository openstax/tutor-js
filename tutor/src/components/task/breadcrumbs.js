import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import { TaskStepActions, TaskStepStore } from '../../flux/task-step';
import { TaskProgressActions, TaskProgressStore } from '../../flux/task-progress';
import { TaskPanelActions, TaskPanelStore } from '../../flux/task-panel';
import { TaskStore } from '../../flux/task';

import _ from 'underscore';

import { ResizeListenerMixin } from 'shared';
import { BreadcrumbTaskDynamic } from '../breadcrumb';

export default createReactClass({
  displayName: 'Breadcrumbs',
  mixins: [ResizeListenerMixin],

  propTypes: {
    id: PropTypes.string.isRequired,
    goToStep: PropTypes.func.isRequired,
  },

  getInitialState() {
    const currentStep = TaskProgressStore.get(this.props.id);

    return {
      updateOnNext: true,
      hoverCrumb: currentStep,
      shouldShrink: null,
      crumbsWidth: null,
      currentStep,
    };
  },

  UNSAFE_componentWillMount() {
    this._isMounted = true;
    const crumbs = this.getCrumbs();

    // if a recovery step needs to be loaded, don't update breadcrumbs
    TaskStore.on('task.beforeRecovery', this.stopUpdate);
    // until the recovery step has been loaded
    TaskStore.on('task.afterRecovery', this.update);

    this.startListeningForProgress();

    this.updateListeners(crumbs);
    return this.setState({ crumbs });
  },

  componentDidMount() {
    return this.calculateCrumbsWidth();
  },

  updateListeners(crumbs) {
    const listeners = this.getMaxListeners(crumbs);
    // TaskStepStore listeners include:
    //   One per step for the crumb status updates
    //   Two additional listeners for step loading and completion
    //     if there are placeholder steps.
    //   One for step being viewed in the panel itself
    //     this is the + 1 to the max listeners being returned
    //
    // Only update max listeners if it is greater than the default of 10
    if ((listeners != null) && ((listeners + 1) > 10)) { return TaskStepStore.setMaxListeners(listeners + 1); }
  },

  getMaxListeners(crumbs) {
    let listeners;
    return listeners = _.reduce(crumbs, function(memo, crumb) {
      const crumbListeners = crumb.type === 'placeholder' ? 3 : 1;
      return memo + crumbListeners;
    }
      , 0);
  },

  getCrumbs() {
    return TaskPanelStore.get(this.props.id);
  },

  calculateCrumbsWidth(crumbDOM) {
    if (this._isMounted) {
      let currentCrumbWidth = 0;
      let crumbsWidth = _.reduce(this.refs, function(memo, ref) {
        const refDOM = ReactDOM.findDOMNode(ref);
        const computedStyle = window.getComputedStyle(refDOM);
        const refDOMBox = refDOM.getBoundingClientRect();
        currentCrumbWidth = refDOMBox.width + parseInt(computedStyle.marginRight) + parseInt(computedStyle.marginLeft);
        return currentCrumbWidth + memo;
      }
        , 0);

      crumbsWidth += currentCrumbWidth;
      if (crumbsWidth > this.state.crumbsWidth) { return this.setState({ crumbsWidth }); }
    }
  },

  componentWillUnmount() {
    this._isMounted = false;
    TaskStepStore.setMaxListeners(10);
    TaskStore.off('task.beforeRecovery', this.stopUpdate);
    TaskStore.off('task.afterRecovery', this.update);
    return this.stopListeningForProgress();
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.didWidthChange(prevState, this.state)) {
      return this.setShouldShrink(this.state);
    }
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.stopListeningForProgress();
      this.startListeningForProgress(nextProps);
    }
    const crumbs = this.getCrumbs();
    this.updateListeners(crumbs);
    return this.setState({ hoverCrumb: nextProps.currentStep, crumbs });
  },

  stopListeningForProgress(props) {
    if (props == null) { (({ props } = this)); }
    const { id } = props;

    return TaskProgressStore.off(`update.${id}`, this.setCurrentStep);
  },

  startListeningForProgress(props) {
    if (props == null) { (({ props } = this)); }
    const { id } = props;

    return TaskProgressStore.on(`update.${id}`, this.setCurrentStep);
  },

  crumbMounted() {
    if (this.state.crumbsWidth != null) { return this.calculateCrumbsWidth(); }
  },

  didWidthChange(prevState, currentState) {
    return (currentState.crumbsWidth !== prevState.crumbsWidth) || (currentState.componentEl.width !== prevState.componentEl.width);
  },

  setShouldShrink(sizes) {
    const shouldShrink = sizes.componentEl.width < this.state.crumbsWidth;
    return this.setState({ shouldShrink });
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.updateOnNext;
  },

  update() {
    return this.setState({ updateOnNext: true });
  },

  setCurrentStep({ previous, current }) {
    return this.setState({ currentStep: current });
  },

  stopUpdate() {
    return this.setState({ updateOnNext: false });
  },

  updateHoverCrumb(hover) {
    return this.setState({ hoverCrumb: hover });
  },

  render() {
    const { crumbs, currentStep } = this.state;
    const { goToStep, wrapper } = this.props;

    let stepButtons = _.map(crumbs, (crumb, crumbIndex) => {
      const crumbStyle = {};
      const zIndex = crumbs.length - Math.abs(this.state.hoverCrumb - crumbIndex);
      if (zIndex) { crumbStyle.zIndex = zIndex; }

      return (
        <BreadcrumbTaskDynamic
          onMouseEnter={this.updateHoverCrumb.bind(this, crumbIndex)}
          onMouseLeave={this.updateHoverCrumb.bind(this, this.props.currentStep)}
          onMount={this.crumbMounted}
          style={crumbStyle}
          crumb={crumb}
          data-label={crumb.label}
          currentStep={currentStep}
          goToStep={goToStep}
          stepIndex={crumbIndex}
          key={`breadcrumb-${crumb.type}-${crumbIndex}`}
          ref={`breadcrumb-${crumb.type}-${crumbIndex}`} />
      );
    });

    if (wrapper != null) {
      const Wrapper = wrapper;
      stepButtons = _.map(stepButtons, (crumb, crumbIndex) => <Wrapper key={`crumb-wrapper-${crumbIndex}`} breadcrumb={crumb} />);
    }

    let classes = 'task-breadcrumbs';
    if (this.state.shouldShrink) { classes += ' shrink'; }

    return (
      <div className={classes}>
        {stepButtons}
      </div>
    );
  },
});
