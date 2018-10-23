import React                  from 'react';

import { omit }               from 'lodash';

import CenteredWheel          from './centered-wheel';

export default class CenteredNoHoleWheel extends React.Component {

  render () {
    const step = this.props.step;
    // close hole
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0,
    };

    return (
      <CenteredWheel
        {...omit(this.props, 'step')}
        step={step}
      />
    );
  }
}
