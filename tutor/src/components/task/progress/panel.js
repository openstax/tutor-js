import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import keymaster from 'keymaster';
import classnames from 'classnames';
import ObscuredPage from '../../obscured-page';
import PagingNavigation from '../../paging-navigation';

import { TaskStore, TaskActions } from '../../../flux/task';
import { StepCard } from '../../../helpers/policies';
import { TaskStepStore } from '../../../flux/task-step';
import { TaskPanelStore } from '../../../flux/task-panel';

import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

const ProgressCard = createReactClass({
  displayName: 'ProgressCard',

  propTypes: {
    taskId: PropTypes.string,
    stepId: PropTypes.string,
    stepKey: PropTypes.number,
    goToStep: PropTypes.func,
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return this.getShouldShows();
  },

  componentWillUnmount() {
    return TaskStore.off('step.completed', this.updateShouldShows);
  },

  UNSAFE_componentWillMount() {
    return TaskStore.on('step.completed', this.updateShouldShows);
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    const props = ['stepKey', 'stepId', 'isSpacer'];
    if (isEqual(pick(this.props, props), pick(nextProps, props))) { return; }

    return this.setState(this.getShouldShows(nextProps));
  },

  getShouldShows(props = this.props) {
    const { stepKey, stepId, isSpacer } = props;

    return {
      shouldShowLeft: stepKey > 0,
      shouldShowRight: isSpacer || ((stepId != null) && StepCard.canForward(stepId)),
      isCompleting: false,
    };
  },

  updateShouldShows() {
    return this.setState(this.getShouldShows());
  },

  // silence React return value warning
  goForward() {
    const { stepId, taskId } = this.props;
    if (stepId && !__guard__(TaskStepStore.get(stepId), x => x.is_completed)) {
      this.setState({ isCompleting: true });
      TaskStore.once('step.completed', () => {
        this.props.goToStep(this.props.stepKey + 1);
        return this.setState({ isCompleting: false });
      });
      TaskActions.completeStep(stepId, taskId);
    } else {
      this.props.goToStep(this.props.stepKey + 1);
    }
    return undefined;
  },

  // silence React return value warning
  goBackward() {
    this.props.goToStep(this.props.stepKey - 1);
    return undefined;
  },

  render() {
    const { isCompleting } = this.state;
    const isLoading = TaskStepStore.isLoading(this.props.stepId);
    const titles = TaskPanelStore.getTitlesForStepIndex(this.props.taskId, this.props.stepKey);
    const className = classnames('progress-panel', { 'page-loading': isCompleting || isLoading });

    return (
      <ObscuredPage>
        <PagingNavigation
          className={className}
          enableKeys={this.props.enableKeys}
          isForwardEnabled={this.state.shouldShowRight}
          isBackwardEnabled={this.state.shouldShowLeft}
          onForwardNavigation={this.goForward}
          onBackwardNavigation={this.goBackward}
          titles={titles}>
          {this.props.children}
        </PagingNavigation>
      </ObscuredPage>
    );
  },
});
export default ProgressCard;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}