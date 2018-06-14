import React from 'react';
import cn from 'classnames';
import { omit } from 'lodash';
import { Tooltip }  from 'react-joyride';

export default class Biology2eAvailable extends React.Component {

  static propTypes = {
    step: React.PropTypes.object,
  }

  render () {
    const ttprops = omit(this.props, 'step', 'buttons', 'children');
    const { step } = this.props;
    step.text = this.props.children;

    return (
      <Tooltip
        {...ttprops}
        step={step}
        disableOverlay={true}
        hideBackButton={true}
        className={cn("mini-notice", this.props.className)}
      />
    );
  }
}
