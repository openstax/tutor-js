import React from 'react';
import { pick } from 'lodash';

import AsyncButton from '../buttons/async-button';
import { propTypes, props } from './props';

class ExContinueButton extends React.Component {
  static defaultProps = {
    isContinueFailed: false,
    waitingText: null,
    isContinueEnabled: true,
  };
  static displayName = 'ExContinueButton';

  static propTypes = propTypes.ExContinueButton;

  render() {
    const { isContinueEnabled, isContinueFailed, waitingText, onContinue, children } = this.props;
    const buttonText = children || 'Continue';

    return (
      <AsyncButton
        variant="primary"
        className="continue"
        key="step-continue"
        onClick={onContinue}
        disabled={!isContinueEnabled}
        isWaiting={!!waitingText}
        waitingText={waitingText}
        aria-controls="paged-content"
        isFailed={isContinueFailed}
      >
        {buttonText}
      </AsyncButton>
    );
  }
}

class ExReviewControls extends React.Component {
  static defaultProps = {
    review: '',
    canTryAnother: false,
    isRecovering: false,
  };
  static displayName = 'ExReviewControls';

  static propTypes = propTypes.ExReviewControls;

  render() {
    let tryAnotherButton;
    const { review, canTryAnother, tryAnother, isRecovering, children } = this.props;
    const { isContinueFailed, waitingText, onContinue, isContinueEnabled } = this.props;

    const continueButtonText = canTryAnother ? 'Move On' : children;

    if (canTryAnother) {
      tryAnotherButton = <AsyncButton
        key="step-try-another"
        variant="primary"
        className="-try-another"
        onClick={tryAnother}
        isWaiting={isRecovering}
        waitingText="Loading Another…">
        {'\
  Try Another\
  '}
      </AsyncButton>;
    }

    const continueButton =
      review !== 'completed' ? <ExContinueButton
        key="step-continue"
        isContinueFailed={isContinueFailed}
        waitingText={waitingText}
        onContinue={onContinue}
        isContinueEnabled={isContinueEnabled}>
        {continueButtonText}
      </ExContinueButton> : undefined;

    return (
      <div className="task-footer-buttons" key="step-buttons">
        {tryAnotherButton}
        {continueButton}
      </div>
    );
  }
}

const CONTROLS = {
  'free-response': ExContinueButton,
  'multiple-choice': ExContinueButton,
  'review': ExReviewControls,
  'teacher-read-only': ExContinueButton,
};

const CONTROLS_TEXT = {
  'free-response': 'Answer',
  'multiple-choice': 'Submit',
  'review': 'Next Question',
  'teacher-read-only': 'Next Question',
};

class ExControlButtons extends React.Component {
  static defaultProps = {
    disabled: false,
    isContinueEnabled: false,
    allowKeyNext: false,
  };

  static displayName = 'ExerciseControlButtons';

  shouldComponentUpdate(nextProps) {
    return (nextProps.panel != null);
  }

  render() {
    let { panel, controlButtons, controlText } = this.props;

    const ControlButtons = CONTROLS[panel];
    if (controlText == null) { controlText = CONTROLS_TEXT[panel]; }

    const controlProps = pick(this.props, props.ExReviewControls);
    controlProps.children = controlText;

    return <ControlButtons {...controlProps} />;
  }
}

class ExerciseDefaultFooter extends React.Component {
  static displayName = 'ExerciseDefaultFooter';

  render() {
    return (
      <div>
        {this.props.controlButtons}
      </div>
    );
  }
}

class ExFooter extends React.Component {
  static defaultProps = {
    disabled: false,
    isContinueEnabled: false,
    allowKeyNext: false,
    footer: <ExerciseDefaultFooter />,
  };

  static displayName = 'ExFooter';

  render() {
    const { footer, idLink } = this.props;

    const footerProps = pick(this.props, props.StepFooter);
    if (footerProps.controlButtons == null) { footerProps.controlButtons = <ExControlButtons {...this.props} />; }

    return (
      <div>
        {React.cloneElement(footer, footerProps)}
        {idLink}
      </div>
    );
  }
}


export { ExContinueButton, ExReviewControls, ExControlButtons, ExFooter };
