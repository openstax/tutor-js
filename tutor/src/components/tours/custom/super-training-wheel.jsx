import React        from 'react';
import { Tooltip }  from 'react-joyride';

import defaultsDeep from 'lodash/defaultsDeep';
import omit         from 'lodash/omit';
import classnames   from 'classnames';

export default class SuperTrainingWheel extends React.PureComponent {
  render () {
    const step = this.props.step;
    const buttons = (
      this.props.ride.joyrideRef &&
      this.props.ride.joyrideRef.props.steps.length < 3
    )? { primary: 'Continue' } : {};
    const className = classnames('super-training-wheel',  this.props.className);

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
      <Tooltip
        {...omit(this.props, 'style', 'buttons')}
        className={className}
        step={step}
        buttons={buttons}
      />
    );
  }
}
