import React from 'react';
import _ from 'underscore';

import classnames from 'classnames';
import keymaster from 'keymaster';

import ExerciseGroup from './group';
import { CardBody } from '../pinned-header-footer-card/sections';

import { ExFooter } from './controls';
import { ExMode } from './mode';

import { propTypes, props } from './props';

const CONTINUE_CHECKS = {
  'free-response': 'freeResponse',
  'multiple-choice': 'answerId',
  'review': null,
  'teacher-read-only': null,
};

const ON_CHANGE = {
  'free-response': 'onFreeResponseChange',
  'multiple-choice': 'onAnswerChanged',
  'review': 'onChangeAnswerAttempt',
  'teacher-read-only': 'onChangeAnswerAttempt',
};

class ExerciseStepCard extends React.Component {
  static defaultProps = {
    disabled: false,
    isContinueEnabled: true,
    allowKeyNext: false,
    includeGroup: true,
    includeFooter: true,
  };

  static displayName = 'ExerciseStepCard';
  static propTypes = propTypes.ExerciseStepCard;

  constructor(props, context) {
    super(props, context);
    let stepState;
    this.state = stepState = this.getStepState(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) &&
      (this.props.isContinueEnabled === this.isContinueEnabled(this.props, this.state)) &&
      (this.isContinueEnabled(this.props, this.state) === this.isContinueEnabled(nextProps, nextState)));
  }

  onAnswerChanged = (answer) => {
    this.setState({ answerId: answer.id });
    return (typeof this.props.onAnswerChanged === 'function' ? this.props.onAnswerChanged(answer) : undefined);
  };

  onChangeAnswerAttempt = (answer) => {
    const { id } = this.props;

    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.');
    return (typeof this.props.onChangeAnswerAttempt === 'function' ? this.props.onChangeAnswerAttempt(id, answer) : undefined);
  };

  onContinue = () => {
    const { id, panel, canReview, onNextStep, onStepCompleted, onContinue, isContinueEnabled } = this.props;

    if (!isContinueEnabled || !this.isContinueEnabled(this.props, this.state)) { return; }

    if (onContinue != null) {
      onContinue(this.state);
      return;
    }

    if (panel === 'multiple-choice') {
      onStepCompleted(id);
      if (!canReview) { return onNextStep(id); }
    }
  };

  onFreeResponseChange = (freeResponse) => {
    const { id } = this.props;

    this.setState({ freeResponse });
    return (typeof this.props.onFreeResponseChange === 'function' ? this.props.onFreeResponseChange(id, freeResponse) : undefined);
  };

  getStepState = (props, state = {}) => {
    const { freeResponse } = state;
    const { step } = props;
    return {
      freeResponse: step.free_response || step.cachedFreeResponse || freeResponse || '',
      answerId: step.answer_id || '',
    };
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.getStepState(this.props, this.state), this.getStepState(nextProps))) {
      const nextStepState = this.getStepState(nextProps);
      this.setState(nextStepState);
    }

    if (this.props.allowKeyNext !== nextProps.allowKeyNext) {
      return this.updateKeyBind(nextProps.allowKeyNext);
    }
  }

  clearKeys = () => {
    keymaster.unbind('enter', 'multiple-choice');
    return keymaster.deleteScope('multiple-choice');
  };

  isContinueEnabled = (props, state) => {
    const { panel } = props;
    const toCheck = CONTINUE_CHECKS[panel];
    if (toCheck == null) { return true; }
    return (state[toCheck] != null ? state[toCheck].trim().length : undefined) > 0;
  };

  startKeys = () => {
    keymaster('enter', 'multiple-choice', this.onContinue);
    return keymaster.setScope('multiple-choice');
  };

  updateKeyBind = (allowKeyNext) => {
    if (allowKeyNext) { return this.startKeys(); } else { return this.clearKeys(); }
  };

  render() {
    let exerciseGroup, footer;
    const {
      step,
      panel,
      pinned,
      helpLink,
      isContinueEnabled,
      waitingText,
      className,
      includeFooter,
      includeGroup,
      idLink,
    } = this.props;

    const { group, related_content } = step;

    const onInputChange = ON_CHANGE[panel];

    const panelProps = _.omit(this.props, props.notPanel);
    panelProps.choicesEnabled = !waitingText && (panel === 'multiple-choice');
    panelProps[onInputChange] = this[onInputChange];

    const controlProps = {
      isContinueEnabled: isContinueEnabled && this.isContinueEnabled(this.props, this.state),
      onContinue: this.onContinue,
    };

    if (includeFooter) {
      let footerProps = this.props;
      if (pinned) { footerProps = _.omit(footerProps, 'idLink'); }
      footer = <ExFooter {...footerProps} {...controlProps} />;
    }

    if (includeGroup) {
      exerciseGroup =
        <ExerciseGroup
          key="step-exercise-group"
          project={this.props.project}
          group={group}
          exercise_uid={step.content != null ? step.content.uid : undefined}
          related_content={related_content} />;
    }

    const cardClasses = classnames(
      'task-step',
      'openstax-exercise-card',
      className,
      {
        'deleted-homework': ((this.props.task != null ? this.props.task.type : undefined) === 'homework') && (this.props.task != null ? this.props.task.is_deleted : undefined),
        'deleted-reading': ((this.props.task != null ? this.props.task.type : undefined) === 'reading') && (this.props.task != null ? this.props.task.is_deleted : undefined),
      },
    );


    return (
      <CardBody className={cardClasses} pinned={pinned} footer={footer}>
        <div className={`exercise-${panel}`} data-step={this.props.stepPartIndex}>
          {exerciseGroup}
          <ExMode focusParent={this} {...step} {...panelProps} mode={panel} />
          {pinned ? idLink : undefined}
        </div>
        {helpLink}
      </CardBody>
    );
  }
}

export default ExerciseStepCard;
