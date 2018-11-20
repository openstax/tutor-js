import PropTypes from 'prop-types';
import React                  from 'react';

import { action }             from 'mobx';

import { defaultsDeep, omit } from 'lodash';
import classnames             from 'classnames';

import CenteredNoHoleWheel    from './centered-no-hole-wheel';
import { bindClickHandler }   from './common';

import Router from '../../../helpers/router';

export default class NewEnrollmentLink extends React.Component {

  className = 'new-enrollment-link-wheel'

  static contextTypes = {
    router: PropTypes.object,
  }

  @action.bound
  handleClick = bindClickHandler.call(this, {
    next: this.triggerNext.bind(this),
    close: this.triggerNext.bind(this),
    skip: this.triggerView.bind(this),
  });

  triggerNext() {
    if (this.props.step.step.tour.autoplay) {
      this.props.step.joyrideRef.next();
      return true;
    }
    return false;
  }

  triggerView() {
    const { courseId } = this.props.step.region;

    this.context.router.history.push(
      Router.makePathname('courseSettings', { courseId })
    );

    this.props.step.joyrideRef.props.callback({
      type: 'finished',
      action: 'finished',
    });

    return false;
  }

  render() {
    const { step } = this.props;
    const buttons = {
      primary: 'I\'ll get them later',
      skip: 'Go to the new links',
    };
    const className = classnames(this.className, this.props.className);
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