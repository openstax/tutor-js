import React                  from 'react';

import { omit }               from 'lodash';

import { Tooltip }  from 'react-joyride';

export default class NoHoleWheel extends React.Component {

  render () {
    const step = this.props.step;
    // close hole
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0,
    };

    return (
      <Tooltip
        {...omit(this.props, 'step')}
        step={step}
      />
    );
  }
}
