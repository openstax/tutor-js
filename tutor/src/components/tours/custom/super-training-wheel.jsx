import React                  from 'react';

import { action }             from 'mobx';

import { defaultsDeep, omit } from 'lodash';
import classnames             from 'classnames';

import CenteredNoHoleWheel    from './centered-no-hole-wheel';
import { bindClickHandler }   from './common';

export default class SuperTrainingWheel extends React.Component {

  className = 'super-training-wheel'

  @action.bound
  handleClick = bindClickHandler.call(this, { close: this.triggerNext.bind(this) });

  triggerNext() {
    if (this.props.step.step.tour.autoplay) {
      this.props.step.joyrideRef.next();
      return true;
    }

    return false;
  }

  render () {
    const { step } = this.props;
    const buttons = step.step.tour.autoplay ? {
      primary: 'Continue',
      secondary: null,
    } : {};
    const className = classnames(this.className, this.props.className);

    step.text = this.props.children;
    step.isFixed = true;

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, this.props.buttons);

    return (
      <CenteredNoHoleWheel
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
