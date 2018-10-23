import React from 'react';
import BS from 'react-bootstrap';
import classnames from 'classnames';

import _ from 'underscore';
import { StepPanel } from '../../helpers/policies';

import { AsyncButton, CardBody } from 'shared';
import { TaskStore } from '../../flux/task';

import { TaskStepStore } from '../../flux/task-step';

export default {
  renderContinueButton() {
    if (typeof this.hideContinueButton === 'function' ? this.hideContinueButton() : undefined) { return null; }

    // if this is the last step completed and the view is read-only,
    // then you cannot continue, and this will override @isContinueEnabled
    const waitingText = (() => { switch (false) {
    case !TaskStepStore.isLoading(this.props.id): return 'Loading…';
    case !TaskStepStore.isSaving(this.props.id): return 'Saving…';
    default: return null;
      } })();

    const cannotContinue = !StepPanel.canContinue(this.props.id) || !(typeof this.isContinueEnabled === 'function' ? this.isContinueEnabled() : undefined);

    return (
      <AsyncButton
        bsStyle="primary"
        className="continue"
        key="step-continue"
        onClick={this.onContinue}
        disabled={cannotContinue}
        isWaiting={!!waitingText}
        waitingText={waitingText}
        isFailed={TaskStepStore.isFailed(this.props.id)}>
        {(typeof this.continueButtonText === 'function' ? this.continueButtonText() : undefined) || 'Continue'}
      </AsyncButton>
    );
  },

  render() {
    const { pinned, courseId, id, taskId, review, className } = this.props;

    const classes = classnames('task-step', className);

    // from StepFooterMixin
    const footer = typeof this.renderFooter === 'function' ? this.renderFooter({ stepId: id, taskId, courseId, review }) : undefined;
    return (
      <CardBody className={classes} footer={footer} pinned={pinned}>
        {this.renderBody()}
        {typeof this.renderGroup === 'function' ? this.renderGroup() : undefined}
      </CardBody>
    );
  },
};
