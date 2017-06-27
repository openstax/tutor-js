import React                  from 'react';

import { action }             from 'mobx';

import { defaultsDeep, omit } from 'lodash';
import classnames             from 'classnames';

import CenteredNoHoleWheel    from './centered-no-hole-wheel';
import { bindClickHandler }   from './common';

export default class SuperTrainingWheel extends React.PureComponent {

  className = 'super-training-wheel'

  static propTypes = {
    step: React.PropTypes.object,
    onClick: React.PropTypes.func,
    children: React.PropTypes.node,
    buttons: React.PropTypes.object,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
  }

  triggerNext() {
    if (this.props.step.step.tour.autoplay) {
      this.props.step.joyrideRef.next();
      return true;
    }

    return false;
  }

  defaultContinueHandler = bindClickHandler.call(this, { close: this.triggerNext.bind(this) });

  @action.bound
  handleClick(ev) {
    const handler = this.props.onClick || this.defaultContinueHandler;
    handler(ev);
  }

  render () {
    const { step } = this.props;
    const buttons = step.step.tour.autoplay? { primary: 'Continue' } : {};
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
