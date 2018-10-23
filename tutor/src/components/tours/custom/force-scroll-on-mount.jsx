import React        from 'react';

import { omit }               from 'lodash';

import { Tooltip }  from 'react-joyride';

export default class ForceScrollOnMount extends React.Component {
  constructor(props) {
    super(props);

    // force top position
    const { joyrideRef } = this.props.step;
    joyrideRef.props.steps[joyrideRef.state.index].position = 'top';
  }

  render () {
    const step = this.props.step;
    // close hole
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0,
    };
    // hide arrow
    step.style.arrow = {
      display: 'none',
    };

    const adjustedYPos = this.props.yPos + step.joyrideRef.getElementDimensions().height;

    return (
      <Tooltip
        {...omit(this.props, 'step', 'yPos')}
        step={step}
        yPos={adjustedYPos}
      />
    );
  }
}
