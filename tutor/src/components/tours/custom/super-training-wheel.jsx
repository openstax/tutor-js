import React                  from 'react';

import { action }             from 'mobx';

import { defaultsDeep, omit } from 'lodash';
import classnames             from 'classnames';

import CenteredWheel          from './centered-wheel';
import { bindClickHandler }   from './common';

export default class SuperTrainingWheel extends React.PureComponent {

  className = 'super-training-wheel'

  @action.bound
  handleClick = bindClickHandler.call(this, {close: this.triggerNext.bind(this)});

  triggerNext() {
    this.props.step.ride.joyrideRef.next();
  }

  render () {
    const step = this.props.step;
    const buttons = (
      this.props.step.ride.joyrideRef &&
      this.props.step.ride.joyrideRef.props.steps.length < 3
    )? { primary: 'Continue' } : {};
    const className = classnames(this.className,  this.props.className);

    step.text = this.props.children;
    step.isFixed = true;

    // close hole
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0
    };

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, this.props.buttons);

    return (
      <CenteredWheel
        {...omit(this.props, 'style', 'buttons')}
        showOverlay={true}
        className={className}
        step={step}
        buttons={buttons}
        onClick={this.handleClick}
      />
    );
  }
}
