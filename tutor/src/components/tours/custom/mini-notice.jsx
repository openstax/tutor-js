import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { omit } from 'lodash';
import CenteredWheel          from './centered-wheel';

export default class MiniNotice extends React.Component {

  static propTypes = {
    step: PropTypes.object,
  }

  render () {
    const ttprops = omit(this.props, 'step', 'buttons', 'children');
    const { step } = this.props;
    step.text = this.props.children;
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0,
    };

    return (
      <CenteredWheel
        {...ttprops}
        step={step}
        disableOverlay={true}
        hideBackButton={true}
        className={cn('mini-notice', this.props.className)}
      />
    );
  }
}
