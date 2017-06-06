import React        from 'react';
import { Tooltip }  from 'react-joyride';

import defaultsDeep from 'lodash/defaultsDeep';
import omit         from 'lodash/omit';

export default class SuperTrainingWheel extends React.PureComponent {
  render () {
    const step = this.props.step;
    const buttons = { primary: 'Continue' };

    step.text = this.props.children;
    step.isFixed = true;

    step.style.footer = {
      textAlign: 'center',
      paddingBottom: '25px'
    };

    step.style.button = {
      padding: '15px 40px'
    };

    step.style.main = {
      paddingBottom: 0
    };

    step.style.close = {
      display: 'none'
    };

    // close hole
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0
    };

    step.style.width = 1000;
    step.style.padding = 0;

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, this.props.buttons);

    return (
      <Tooltip
        {...omit(this.props, 'style', 'buttons')}
        step={step}
        buttons={buttons}
      />
    );
  }
}
