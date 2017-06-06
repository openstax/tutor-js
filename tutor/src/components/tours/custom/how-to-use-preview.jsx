import React from 'react';
import { action } from 'mobx';

import { Tooltip } from 'react-joyride';


export default class HowToUsePreview extends React.PureComponent {


  @action.bound
  onHide() {
    this.props.ride.joyrideRef.next()
  }

  render () {
    const step = this.props.step;
    step.text = <div>
      <h3>This is how you use Preview!</h3>
    </div>

    return (
      <Tooltip
        {...this.props}
        step={step}
        buttons={{
          primary: 'Continue'
        }}
      />

    );
  }
}
